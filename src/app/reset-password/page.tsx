"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("invalid or missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("password do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      toast.success(response.data.message || "password reset successfull");

      setPassword("");
      setConfirmPassword("");

      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-500 p-8 shadow-lg sm:p-10">
        <h1 className="text-center text-3xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mt-3 text-center text-sm text-gray-200">
          Enter your new password below.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-white"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-white"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-white underline hover:text-blue-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
