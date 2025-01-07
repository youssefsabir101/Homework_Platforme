"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from "framer-motion";


const BackgroundSquare = ({ className, initialX, initialY, direction }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 2], [initialX, initialX + (direction === 'left' ? -2000 : 2000)]);
  const y = useTransform(scrollYProgress, [0, 2], [initialY, initialY + (direction === 'up' ? -1000 : 1000)]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
  
  return (
    <motion.div
      className={`fixed w-60 h-60 rounded-full bg-opacity-50 blur-2xl ${className}`}
      style={{ 
        x,
        y,
        rotate,
        scale,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default function LoginPage() {
  const { scrollYProgress } = useScroll();
  const scrollY = useSpring(scrollYProgress);
  const yProgress = useTransform(scrollY, [0, 1], [0, -3000]);
  const opacityProgress = useTransform(scrollY, [0, 0.5], [1, 0]);
  const controls = useAnimation();

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

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
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 relative bg-gradient-to-b from-blue-100 to-white overflow-hidden"> 
      {/* Shapes moving in the background */}
      {/* Background Squares */}
      <BackgroundSquare className="bg-blue-500 top-1/2 left-1/2 z-0" initialX={0} initialY={0} direction="up" />
      <BackgroundSquare className="bg-sky-500 top-3/4 right-1/2 z-0" initialX={600} initialY={-50} direction="down" />
      <BackgroundSquare className="bg-sky-500 top-1/4 right-1/4 z-0" initialX={300} initialY={-50} direction="left" />
      <BackgroundSquare className="bg-blue-800 top-1/4 right-1/4 z-0" initialX={1000} initialY={-10} direction="left" />
      <BackgroundSquare className="bg-sky-500 bottom-1/4 left-1/4 z-0" initialX={-300} initialY={-100} direction="right" />
      <BackgroundSquare className="bg-indigo-500 bottom-1/4 left-1/4 z-0" initialX={-900} initialY={-20} direction="up" />


      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-100 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></motion.div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Connexion</h1>
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
                        className="h-4 w-4"
                      />
                      <label className="text-gray-600 pl-1">Étudiant
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="teacher"
                        checked={role === "teacher"}
                        onChange={() => setRole("teacher")}
                        className="h-4 w-4"
                      />
                      <label className="text-gray-600 pl-1">Enseignant</label>
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
                        Code de Massar
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
                      Mot de passe
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="relative">
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md px-2 py-1">
                      Connexion
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
