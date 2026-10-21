"use client";
import Link from "next/link";
import react from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = react.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = react.useState(false);
  const [loading, setLoading] = react.useState(false);


  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login Success", response.data);
      toast.success("Login Successful");
      router.push("/profile");
    } catch (error) {
      console.error("Login Error", error);
      toast.error("Login Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">{loading ? "Logging in..." : "Login"}</h1>
      
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
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link href="/signup" className="text-blue-500">
        Don't have an account? Sign Up
      </Link>
    </div>
  );
}
