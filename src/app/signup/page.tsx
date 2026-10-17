"use client"
import Link from "next/link"
import react from "react"
import {useRouter} from "next/navigation"
import axios from "axios"

export default function SignupPage(){
    const [user , setUser] = react.useState({
        username: "",
        email: "",
        password: ""
    })

    const onSignup = async()=>{

    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">Sign Up</h1>
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
          Sign Up
        </button>

        <Link href="/login" className="text-blue-500">
          Already have an account? Login
        </Link>
      </div>
    );
}