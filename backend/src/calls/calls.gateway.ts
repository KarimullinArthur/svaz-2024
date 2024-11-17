import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/users/users.service';

type Common = {
  id: string,
  offer: unknown,
  socket: Socket,
}
type Client = {
  timeEntered: Date
} & Common

type Queue = Map<Socket, Client>
type Pool = Map<Socket, Common>

type ClientData = {
  token: string
  offer: string
}

@WebSocketGateway(1090, { cors: true })
export class CallsGateway implements OnGatewayDisconnect {
  constructor(private userService: UserService){
  }

  queue: Queue = new Map()
  pool: Pool = new Map()

  @WebSocketServer()
  server: Server;

  decodeJWT(jwt: string){
    return this.userService.validateJWT(jwt)
  }
  makeCall(operator: Common, client: Client){
    this.pool.delete(operator.socket)
    this.queue.delete(client.socket)
    this.handleSignaling(operator.socket, client.socket)
    this.handleSignaling(client.socket, operator.socket)
    operator.socket.emit("offer", client.offer)
  }
  enterOperator(operator: Common){

    if(this.queue.size){
      const last = this.queue.entries().next().value[1]
      this.makeCall(operator, last)
    }else{
      this.pool.set(operator.socket, operator)
    }
  }
  enterClient(client: Client){
    if(this.pool.size){
      const last = this.pool.entries().next().value[1]
      this.makeCall(last, client)
    }else{
      this.queue.set(client.socket, client)
    }
  }

  @SubscribeMessage('entered')
  async handleClientCall(@MessageBody() data: ClientData, @ConnectedSocket() socket: Socket) {
    const {token, offer} = data
    const user = this.decodeJWT(token)
    if(user.isOperator){
      const operator: Common = {
        id: user._id,
        offer: offer,
        socket: socket,
      }
      this.enterOperator(operator)
    }else{
      const client: Client = {
        id: user._id,
        offer: offer,
        socket: socket,
        timeEntered: new Date()
      }
      this.enterClient(client)
    }


  }

  handleDisconnect(client: Socket) {
    this.queue.delete(client)
    this.pool.delete(client)
  }

  handleSignaling(socket1: Socket, socket2: Socket){
    console.log("soedinenie")
    socket1.on('offer', (offer) => {
      socket2.emit('offer', offer);
    });
  
    socket1.on('answer', (answer) => {
      socket2.emit('answer', answer);
    });
  
    socket1.on('ice-candidate', (candidate) => {
      socket2.emit('ice-candidate', candidate);
    });
  
    socket1.on('disconnect', () => {
      socket2.disconnect()
    });
  
  }

}
