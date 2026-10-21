"use client"
import Link from "next/link"
import react, { useEffect, useState } from "react"
import {useRouter} from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

export default function SignupPage(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [user , setUser] = react.useState({
        username: "",
        email: "",
        password: ""
    })

    const onSignup = async()=>{

      try {
        setLoading(true)
        const response = await axios.post("/api/users/signup" , user);
        console.log("signup success" , response.data)
        router.push("/login")

      } catch (error:any) {
        console.log("signup failed" , error.message)
        toast.error(error.message)
      }finally{
        setLoading(false)
      }

    }

    const [buttonDisabled, setbuttonDisabled] = useState(false)


    useEffect(()=>{
      if(user.email.length>0 && user.password.length >0 && user.username.length>0 ){
        setbuttonDisabled(false);
      }else{
        setbuttonDisabled(true)
      }
    },[user])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">{loading ? "Processing" : "Signup"}</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border border-gray-300 rounded-md p-2 mb-4"
        />
        <label htmlFor="email">Email</label>

        <input
          type="email"
          id="email"
          placeholder="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border border-gray-300 rounded-md p-2 mb-4"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border border-gray-300 rounded-md p-2 mb-4"
        />

        <button
          onClick={onSignup}
          className="bg-blue-500 text-white rounded-md p-2 mb-4"
        >
          {buttonDisabled ? "Fill Details" : "Signup"}
        </button>

        <Link href="/login" className="text-blue-500">
          Already have an account? Login
        </Link>
      </div>
    );
}