"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

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
        setError(data.error);
        return;
      }

      if (data.user.role === "teacher") {
        router.push("/teacher/dashboard");
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

  // Animation controls
  const shapeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 0.6,
      scale: 1,
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 relative">
      {/* Shapes moving in the background */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circles */}
        <motion.div
          className="absolute bg-blue-200 rounded-full w-32 h-32"
          style={{ top: "20%", left: "10%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Squares */}
        <motion.div
          className="absolute bg-green-300 w-24 h-24"
          style={{ top: "50%", right: "15%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Triangles */}
        <motion.div
          className="absolute"
          style={{
            top: "35%",
            left: "60%",
            width: 0,
            height: 0,
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "60px solid red",
          }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Lines */}
        <motion.div
          className="absolute bg-purple-400 w-2 h-48"
          style={{ top: "60%", left: "40%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Dots */}
        <motion.div
          className="absolute bg-yellow-400 w-6 h-6 rounded-full"
          style={{ bottom: "20%", right: "30%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* SVG - Circle */}
        <motion.svg
          className="absolute"
          style={{ top: "10%", right: "40%" }}
          width="100"
          height="100"
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        >
          <circle cx="50" cy="50" r="40" stroke="orange" strokeWidth="3" fill="none" />
        </motion.svg>
        {/* New Shapes */}
        {/* Additional Circle */}
        <motion.div
          className="absolute bg-pink-200 rounded-full w-16 h-16"
          style={{ top: "10%", left: "30%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Additional Square */}
        <motion.div
          className="absolute bg-teal-300 w-16 h-16"
          style={{ bottom: "15%", left: "20%" }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Additional Triangle */}
        <motion.div
          className="absolute"
          style={{
            bottom: "25%",
            right: "60%",
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: "40px solid blue",
          }}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.div>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-100 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></motion.div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Login</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  {/* Role Selector */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <input
                        type="radio"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRole("student")}
                      />
                      <label className="text-gray-600">Student</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="teacher"
                        checked={role === "teacher"}
                        onChange={() => setRole("teacher")}
                      />
                      <label className="text-gray-600">Teacher</label>
                    </div>
                  </div>

                  {/* Input fields */}
                  {role === "student" ? (
                    <div className="relative">
                      <input
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                        placeholder="Login Code"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Code Massar
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="email"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Email
                      </label>
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Password
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="relative">
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md px-2 py-1">
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
