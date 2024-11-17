import { makeAutoObservable } from "mobx";
import { User } from "./User";
import { Axios } from "@/api/Axios";
import { AxiosError } from "axios";

export type UserCreateDTO = {
  username: string
  password: string
  email?: string
}

export class Store {
  user?: User
  isLoading = true
  error?: AxiosError
  constructor(){
    makeAutoObservable(this)
    const loading = []
    loading.push(this.setUser())
    Promise.allSettled(loading).then(()=>{this.isLoading = false})
  }
  
  async setUser(){
    const props: User = (await Axios.get('/user')).data
    this.user = User.fromProps(props)
  }
  
  async createUser(user: UserCreateDTO){
    await Axios.post('/user', user)
    await this.login(user)
  }
  
  async login(user: UserCreateDTO): Promise<true | void>{
    const token: AuthToken=(await Axios.post('/user/login', user)).data
    localStorage.setItem('access_token', token.access_token)
    await this.setUser()
  }
  

  
  async updateUser(user: Partial<UserCreateDTO>){
    const res: User = (await Axios.patch('/user', user)).data
    this.user && Object.assign(this.user, res)
  }
  
  logOut(){
    localStorage.removeItem('access_token')
    this.user = undefined
  };

}



export const StoreInstance = new Store()

export interface AuthToken{access_token: string}