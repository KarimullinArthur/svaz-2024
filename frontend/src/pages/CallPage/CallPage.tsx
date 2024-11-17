import { baseUrl } from "@/api/baseUrl";
import { Mic, MicOff, MicOffRounded, MicRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type videoRef =  {current: HTMLVideoElement | null}




export const CallPage = observer((callbacks: Callbacks) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream>()
  const [audio, setAudio] = useState<boolean>(true)

  useEffect(() => {
    const socket = io(baseUrl+':1090');
    const run = async () => {
      const stream = await setLocalStream(localRef)
      localStream.current = stream
      const connection = await createPeerConnection(stream, socket, remoteRef, callbacks)
      await signal(connection)
    }

    run()
    
    return () => {
      socket.disconnect();
      if(localRef.current?.srcObject)localRef.current.srcObject = null
      if(remoteRef.current?.srcObject)remoteRef.current.srcObject = null

    };
  }, []);

  const toggleAudio = () => {
    if(localStream.current) localStream.current.getAudioTracks()[0].enabled = !audio
    setAudio(!audio)
  }


  return (
    <div style={{ width: '100%', height: '100%' }}>
      
      <video ref={remoteRef} autoPlay style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%', border: "3px solid red"}}></video>
      <div>
        <video ref={localRef} autoPlay muted style={{ maxWidth: '300px', maxHeight: '300px', position: "absolute", top: "25vw", border: "3px solid red"}} />
        <Button style={{ position: "absolute", bottom: "25vh", left: "calc(50vw - 30px)"}} onClick={toggleAudio}>{audio ? <MicRounded /> : <MicOffRounded/> }</Button>
      </div>
    </div>
  );
});


const setLocalStream = async (userRef: videoRef) => {
  const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (userRef.current) userRef.current.srcObject = userStream;
  return userStream
};
type Callbacks = {close: ()=>void, setOnlineStatus?: (s: string)=>void,}

const createPeerConnection = (stream: MediaStream, socket: Socket, remoteRef: videoRef, cbs: Callbacks) => {
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  const peerConnection = new RTCPeerConnection(iceServers);
  const remoteStream = new MediaStream();

  // Add local stream tracks to the peer connection
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  // Handle incoming remote stream
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("otpravka")
      socket.emit('ice-candidate', event.candidate);
    }
  };
  
  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", peerConnection.localDescription);
  };

  socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
  });

  const setOnlineStatus = cbs.setOnlineStatus || (()=>{})
  const close = cbs.close

  peerConnection.addEventListener(
    "connectionstatechange",
    () => {
      switch (peerConnection.connectionState) {
        case "new":
        case "connecting":
          setOnlineStatus("Connecting…");
          break;
        case "connected":
          setOnlineStatus("Online");
          break;
        case "disconnected":
          setOnlineStatus("Disconnecting…");
          break;
        case "closed":
          setOnlineStatus("Offline");
          close()
          break;
        case "failed":
          setOnlineStatus("Error");
          close()
          break;
        default:
          setOnlineStatus("Unknown");
          close()
          break;
      }
  
    },
    false,
  );



  socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
    console.log("poluchka")
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });
  socket.on("disconnect", ()=>close())
  

  return {peerConnection, socket}
};


type ConnectionProps = {socket: Socket, peerConnection: RTCPeerConnection}



const signal = async ({socket, peerConnection}: ConnectionProps) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = {
    token: localStorage.getItem('access_token'),
    offer: peerConnection.localDescription,
  };
  socket.emit('entered', data);
}


