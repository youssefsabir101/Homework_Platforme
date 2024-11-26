"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Helper function to read cookies
  const getCookieValue = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || "";
  };

  // Initialize state directly based on cookies
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const initialRole = getCookieValue("role");
    const initialUserId = getCookieValue("id");
    return !!initialRole && !!initialUserId;
  });

  const [userRole, setUserRole] = useState(() => getCookieValue("role"));
  const [userName, setUserName] = useState(() => decodeURIComponent(getCookieValue("name")));

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Update state and redirect to login page
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    router.push("/");
  };

  // Effect to monitor cookie changes and update state
  useEffect(() => {
    const checkAuthState = () => {
      const updatedRole = getCookieValue("role");
      const updatedUserId = getCookieValue("id");
      const updatedName = decodeURIComponent(getCookieValue("name"));

      // Check if user is logged in
      setIsLoggedIn(!!updatedRole && !!updatedUserId);
      setUserRole(updatedRole);
      setUserName(updatedName);
    };

    // Listen for changes to cookies every time the component is rendered or the router path changes
    const intervalId = setInterval(checkAuthState, 1000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [router]);

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  return (
    <nav className="w-full backdrop-blur-sm bg-white/30 text-blue-800 fixed z-50">
      <div className="container mx-auto px-4 py-[6px]">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/#home-page">
              <img src="/img/logo.png" alt="" className="h-8"/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/#how-to-use" className="font-semibold hover:text-blue-800 transit duration-500 ease-in-out">How to Use</Link>
              <Link href="/#about-app" className="font-semibold hover:text-blue-800 transit duration-500 ease-in-out">About App</Link>
              <Link href="/#features" className="font-semibold hover:text-blue-800 transit duration-500 ease-in-out">Features</Link>
              <Link href="/#contact" className="font-semibold hover:text-blue-800 transit duration-500 ease-in-out">Contact</Link>
            </div>
          </div>

          {/* User Profile / Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && userRole === "teacher" && (
              <Link href="/teacher/dashboard">
                <span className="hover:text-blue-400 cursor-pointer">Teacher Dashboard</span>
              </Link>
            )}
            {isLoggedIn && userRole === "student" && (
              <Link href="/student/homework">
                <span className="hover:text-blue-400 cursor-pointer font-semibold">Homework List</span>
              </Link>
            )}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <span className="font-semibold">{userName}</span>
                  <span className="text-sm text-gray-600">({userRole})</span>
                  <ChevronDown size={16} />
                </button>
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-sm transition duration-200">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2"
            >
              <div className="flex flex-col space-y-2">
                <Link href="/#how-to-use">
                  <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                    How to Use
                  </span>
                </Link>
                <Link href="/#about-app">
                  <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                    About App
                  </span>
                </Link>
                <Link href="/#features">
                  <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                    Features
                  </span>
                </Link>
                <Link href="/#contact">
                  <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                    Contact
                  </span>
                </Link>

                {isLoggedIn && userRole === "teacher" && (
                  <Link href="/teacher/dashboard">
                    <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                      Teacher Dashboard
                    </span>
                  </Link>
                )}
                {isLoggedIn && userRole === "student" && (
                  <Link href="/student/homework">
                    <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                      Homework List
                    </span>
                  </Link>
                )}
                {isLoggedIn ? (
                  <>
                    <div className="py-2 px-4 text-sm font-semibold">
                      {userName} <span className="text-gray-600">({userRole})</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <span className="block py-2 px-4 text-sm hover:bg-blue-500 hover:text-white rounded-md">
                      Login
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}