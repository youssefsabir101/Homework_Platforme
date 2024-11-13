"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginCode, setLoginCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role is student
  const [error, setError] = useState("");
  const router = useRouter();

 
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const loginDetails = {
      role,
      ...(role === "student" ? { loginCode } : { email }),
      password,
    };
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.log('Login failed', data);
        setError(data.error);
        return;
      }
  
      console.log('Login successful', data);
  
      // Redirect based on role
      if (data.user.role === "teacher") {
        router.push("/");
      } else if (data.user.role === "student") {
        router.push("/student/homework");
      } else {
        setError("Unexpected role. Please try again.");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Login failed. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role selection */}
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
              />
              Teacher
            </label>
          </div>

          {/* Login fields */}
          {role === "student" ? (
            <input
              type="text"
              placeholder="Login Code"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              className="w-full p-2 border rounded"
            />
          ) : (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
