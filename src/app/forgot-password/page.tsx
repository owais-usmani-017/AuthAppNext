"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

export default function ForgotPassword() {
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);

const onSubmit = async () =>{
  try {
    
    setLoading(true);
    const response  = await axios.post("/api/users/forgotpassword" , {email,})

    toast.success(response.data.message)

  } catch (error:any) {
    toast.error(error.response?.data?.error) || "Something went wrong";
  }finally{
    setLoading(false)
  }
}

return ( <div className=" bg-black flex min-h-screen items-center justify-center px-4"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-500 p-8 shadow-lg sm:p-10">
{/* Heading */} <div className="text-center"> <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
 </div>


      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Forgot Password?
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        No worries! Enter your registered email address and we'll send
        you a link to reset your password.
      </p>
    </div>

    {/* Form */}
    <form 
    onSubmit={(e)=>{
      e.preventDefault();
      onSubmit();
    }}
    className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending Reset Link..." : "Send Reset Link"}
      </button>
    </form>

    {/* Back to Login */}
    <div className="mt-7 text-center text-sm text-gray-600">
      Remember your password?{" "}
      <Link
        href="/login"
        className="font-semibold text-blue-600 transition hover:text-blue-800"
      >
        Back to Login
      </Link>
    </div>
  </div>
</div>


);
}
