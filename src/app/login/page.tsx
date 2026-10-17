"use client";
import Link from "next/link";
import react from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [user, setUser] = react.useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Login</h1>
      
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
        onClick={onLogin}
        className="bg-blue-500 text-white rounded-md p-2 mb-4"
      >
        Login
      </button>

      <Link href="/signup" className="text-blue-500">
        Don't have an account? Sign Up
      </Link>
    </div>
  );
}
