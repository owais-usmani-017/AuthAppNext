"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
    } catch (err: any) {
      setError(true);
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "No token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl font-bold text-green-500">
            Email Verified Successfully!
          </h2>

          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-2xl font-bold text-red-500">
            Error verifying email. Please try again.
          </h2>
        </div>
      )}
    </div>
  );
}
