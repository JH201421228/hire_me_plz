import React, { useEffect } from "react";
import app from './firebase'
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./loginPage/LoginPage";
import RegisterPage from "./registerPage/RegisterPage";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { clearUser, setUser } from "./store/userSlice";
import MainPage from "./mainPage/MainPage";
import RoomPage from "./roomPage/RoomPage";
import QuizPage from "./mainPage/QuizPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const App = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = getAuth(app)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        navigate('/')
        dispatch(setUser({
          uid: user.uid,
          displayName: user.displayName,
        }))
      }
      else {
        navigate('/login')
        dispatch(clearUser())
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/:roomId' element={<RoomPage/>}/>
      <Route path='/quiz/:id' element={<QuizPage/>}/>
    </Routes>
  )
}

export default App