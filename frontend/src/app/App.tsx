import { StoreInstance } from "@/Store/Store"
import { MainPage } from "@/pages/MainPage/MainPage"
import ErrorPage from "@/pages/ErrorPage/ErrorPage"
import { Footer } from "@/widgets/Footer"
import Header from "@/widgets/Header/Header"
import { Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { Route, Routes } from "react-router-dom"
import { BrowserRouter } from "react-router-dom"

const App = observer(() => {
  if(StoreInstance.isLoading){
    return <Typography variant="h1">Loading...</Typography>
  }
  if(StoreInstance.error){
    return <ErrorPage/>
  }
  return (
    <BrowserRouter>
      <Header/>
      <div style={{paddingTop: 76, width:"100vw", height: "100%"}}>
        <Routes>
          <Route path="/" Component={()=><MainPage/>}/>
        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  )
})

export default App
