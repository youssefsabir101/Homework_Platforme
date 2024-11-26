"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaHome, FaBook, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BackgroundShapes = () => {
  const shapes = [
    { type: 'circle', size: 100, color: 'rgba(59, 130, 246, 0.2)' },
    { type: 'square', size: 80, color: 'rgba(16, 185, 129, 0.2)' },
    { type: 'triangle', size: 120, color: 'rgba(249, 115, 22, 0.2)' },
    { type: 'circle', size: 60, color: 'rgba(236, 72, 153, 0.2)' },
    { type: 'square', size: 90, color: 'rgba(139, 92, 246, 0.2)' },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'triangle' ? '0' : '10%',
            backgroundColor: shape.color,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function StudentHomework() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const { scrollY } = useScroll();
  const y = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const containerRef = useRef(null);
  const containerY = useTransform(y, [0, 200], [0, -20]);

  useEffect(() => {
    const checkSession = () => {
      const decodedUserName = decodeURIComponent(
        document.cookie.match('(^|;)\\s*name\\s*=\\s*([^;]+)')?.pop() || ""
      );
      const decodedUserRole = document.cookie.match('(^|;)\\s*role\\s*=\\s*([^;]+)')?.pop() || "";
      const decodedUserId = document.cookie.match('(^|;)\\s*id\\s*=\\s*([^;]+)')?.pop() || "";

      if (!decodedUserRole || !decodedUserId) {
        router.push("/login");
      } else if (decodedUserRole !== "student") {
        router.push("/");
      } else {
        setUserName(decodedUserName);
        setUserRole(decodedUserRole);
        setUserId(decodedUserId);
      }
    };

    checkSession();
  }, [router]);
  
  useEffect(() => {
    async function fetchHomework() {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch homework');
        }
        const data = await response.json();
        setHomeworkList(data);
      } catch (error) {
        console.error("Error fetching homework:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchHomework();
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{error}</p>
      </motion.div>
    </div>
  );

  const filteredHomework = homeworkList.filter((homework) => {
    const matchesCategory = selectedCategory
      ? homework.category && homework.category.id === parseInt(selectedCategory)
      : true;
    const matchesSearch = homework.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredHomework.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHomework = filteredHomework.slice(startIndex, endIndex);

  const categoryColors = {
    1: "bg-red-500",
    2: "bg-green-500",
    3: "bg-blue-500",
    4: "bg-yellow-500",
    5: "bg-purple-500",
    6: "bg-pink-500",
    7: "bg-indigo-500",
    8: "bg-teal-500",
    9: "bg-orange-500",
    10: "bg-cyan-500",
    11: "bg-lime-500",
  };

  return (
    <motion.div 
      className="min-h-screen  bg-gradient-to-b from-blue-100 to-white overflow-hidden pt-16 z-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackgroundShapes />

      <nav aria-label="breadcrumb" className="fixed top-16 w-full p-4 backdrop-blur-sm bg-white bg-opacity-70 z-30">
        <div className="container mx-auto flex items-center space-x-2 text-sm text-blue-800">
          <motion.a whileHover={{ scale: 1.05 }} href="/" className="flex items-center hover:underline">
            <FaHome className="mr-1" /> Home
          </motion.a>
          <span>/</span>
          <span className="font-semibold flex items-center">
            <FaBook className="mr-1" /> Homeworks
          </span>
        </div>
      </nav>

      <motion.div 
        ref={containerRef}
        className="relative z-10 container mx-auto overflow-hidden mt-16 h-full w-full p-8"
        style={{ y: containerY }}
      >
        <motion.h1 
          className="flex items-center text-3xl font-bold mb-6 mx-2 text-blue-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-2 h-6 bg-blue-800 mr-3 flex-shrink-0"></div>
          <h1 className="text-2xl font-bold text-blue-800">
            Homework Assignments
          </h1>
        </motion.h1>

        <motion.div 
          className="mb-6 mx-2 flex flex-col sm:flex-row gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-full sm:w-1/2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative w-full sm:w-1/2">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:gap-2 lg:grid-cols-3 gap-6 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {currentHomework.map((homework) => {
            const categoryColor = categoryColors[homework.category?.id] || "bg-gray-500";

            return (
              <motion.div
                key={homework.id}
                className="bg-white  md:mx-2 my-1 border rounded-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transform overflow-hidden hover:scale-105 relative" 
                
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute -top-6 left-0 w-2 h-20 rotate-45  ${categoryColor}`} />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 truncate">{homework.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{homework.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{homework.teacher && (
                            <p className="text-gray-500 mb-4">Created by: {homework.teacher.name}</p>
                          )}
                    </span>
                    <span className="text-blue-500 font-semibold">{homework.category ? homework.category.name : 'No Category'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <Link href={`/student/homework/${homework.id}`}>
                    <motion.button
                      className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                  </Link>
                    <span className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full">Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {totalPages > 1 && (
          <motion.div 
            className="mt-8 flex justify-center items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronLeft />
            </motion.button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronRight />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}