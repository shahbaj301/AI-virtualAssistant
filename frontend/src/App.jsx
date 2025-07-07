import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import SignUp from "./routers/SignUp"
import SignIn from "./routers/Signin"
import Customize from "./routers/Customize"
import { useContext } from "react"
import { userDataContext } from "./context/UserContext"
import Home from "./routers/Home"
import Customize2 from "./routers/Customize2"

// import SignUp from "../routers/SignUp"
// import SignIn from "../routers/SignIn"

function App() {
  const{userData,setUserData}=useContext(userDataContext);

  

  return (
    <>
      <Routes>
        <Route path='/' element={(userData?.assistantImage && userData?.assistantName)?<Home/>:<Navigate to={"/customize"}/>}/>
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
        <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
        <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"}/>}/>
        <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"}/>}/>
      </Routes>
    </>
  )
}

export default App
