"use client"

import toast from "react-hot-toast";
import axios from "axios";
import React from "react";
import { useState } from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = React.useState("");

  const logout = async ()=>{
    try {
      await axios.get('/api/users/logout');
      toast.success("logout successfull");
      router.push('/login')

    } catch (error:any) {
      console.log(error.message)
      toast.error("logout Unsuccessfull")
    }
  }

  const getUserDetails = async()=>{
    const res = await axios.get('/api/users/me');
    console.log(res.data)
    setData(res.data.data._id);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Profile</h1>
      <h2 className="text-lg font-semibold">{data=== "" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>} </h2>
      <hr />

    <button onClick={logout} className="border rounded-md p-2 mt-2 bg-blue-500 font-bold">Logout</button>

    <button onClick={getUserDetails} className="border rounded-md p-2 mt-2 bg-green-800 font-bold">Get User Details</button>

    </div>
  );
}