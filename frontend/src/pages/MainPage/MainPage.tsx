import { StoreInstance } from "@/Store/Store";
import { CallPage } from "@/pages/CallPage/CallPage";
import ProfileButton from "@/widgets/ProfileButton/ProfileButton";
import { Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AdminPage } from "../AdminPage/AdminPage";

export const MainPage: React.FC = observer(()=>{
  const user = StoreInstance.user
  if(!user) {
    return <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <div><Typography variant="h4">Пожалуйста, войдите в учетную запись</Typography></div>
      <ProfileButton/>
    </div>
  }
  if(user.isAdmin){
    return <AdminPage/>
  }else{
    return <CallContainer isOperator={user.isOperator}/>
  }
})

const CallContainer = ({isOperator}: {isOperator: boolean}) => {
  const [callOpened, setCallOpened] = useState(false)
  return <div style={{width: "100%", height: "100%"}}>
    {
      callOpened 
      ?
      <CallPage close={()=>setCallOpened(false)}/>
      :
      <div style={{width: "100%",display: "flex", justifyContent: "center", height: "100%", alignItems: "center"}}><Button onClick={()=>setCallOpened(true)} size="large" variant='contained'>{isOperator ? "Начать принимать звонки" : "Запросить Тех. Поддержку"}</Button></div>

    }
  </div>
}