import React, { useState } from "react";
import app, { db } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useForm } from "react-hook-form";


const LoginPage = () => {
    const [loading, setLoading] = useState(false)

    const [errorFromSubmit, setErrorFromSubmit] =useState("")

    const auth = getAuth(app)

    const {register, watch, formState:{errors}, handleSubmit} = useForm()


    const onSubmit = async(data) => {
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, data.email, data.password)
        }
        catch (error) {
            console.error(error)
            setErrorFromSubmit(error.message)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 3000)
        }
        finally {
            setLoading(false)
        }
    }
    
  return (
    <div className='container'>
        <div style={{ textAlign: 'center' }}>
            <h3>Log In</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='email'>Email</label>
            <input 
                name='email'
                type='email'
                id='email'
                {...register("email", {required: true, pattern: /^\S+@\S+$/i})}
            />
            {errors.email && <p>This email field is required</p>}

            <label htmlFor="password">Password</label>
            <input 
                name='password'
                type="password" 
                id='password'
                {...register("password", {required: true, minLength: 6})}
            />
            {errors.password && errors.password.type === "required" && <p>This password field is required</p>}
            {errors.password && errors.password.type === "maxLength" && <p>Password must have at least 6 characters</p>}

            {errorFromSubmit && <p>{errorFromSubmit}</p>}

            <input type="submit" disabled = {loading} />
            <Link style={{color: 'grey', textDecoration: 'none'}} to={'/register'}>회원가입</Link>
        </form>
    </div>
  )
}

export default LoginPage