"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Toast from "@/app/components/Toast";
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTrashAlt, FaEdit, FaSearch, FaPlus, FaHome, FaChalkboardTeacher } from 'react-icons/fa';

export default function TeacherDashboard() {
  const [homeworks, setHomeworks] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [homeworkToDelete, setHomeworkToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const userName = document.cookie.match("(^|;)\\s*name\\s*=\\s*([^;]+)")?.pop() || "";
    const userRole = document.cookie.match("(^|;)\\s*role\\s*=\\s*([^;]+)")?.pop() || "";
    const userId = document.cookie.match("(^|;)\\s*id\\s*=\\s*([^;]+)")?.pop() || "";
    setUserName(userName);
    setUserRole(userRole);
    setUserId(userId);

    const checkSession = () => {
      const decodedUserName = decodeURIComponent(
        document.cookie.match("(^|;)\\s*name\\s*=\\s*([^;]+)")?.pop() || ""
      );
      const decodedUserRole = document.cookie.match("(^|;)\\s*role\\s*=\\s*([^;]+)")?.pop() || "";
      const decodedUserId = document.cookie.match("(^|;)\\s*id\\s*=\\s*([^;]+)")?.pop() || "";

      if (!decodedUserRole || !decodedUserId) {
        router.push("/login");
      } else if (decodedUserRole !== "teacher") {
        router.push("/");
      } else {
        setUserName(decodedUserName);
        setUserRole(decodedUserRole);
        setUserId(decodedUserId);
        console.log(`Welcome ${decodedUserName} (ID: ${decodedUserId})`);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    async function fetchHomeworks() {
      try {
        const response = await fetch(`/api/assignments?teacherId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch homework data");
        }
        const data = await response.json();
        setHomeworks(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userId) {
      fetchHomeworks();
    }
  }, [userId]);

  const showSuccessToast = (message) => {
    setToast({ message, type: "success", visible: true });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const confirmDelete = (id) => {
    setHomeworkToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/assignments/${homeworkToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete homework");
      }
      setHomeworks((prev) => prev.filter((hw) => hw.id !== homeworkToDelete));
      setShowDeleteModal(false);
      setHomeworkToDelete(null);
      showSuccessToast("Homework deleted successfully");
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to delete homework", type: "error", visible: true });
    }
  };

  const filteredHomeworks = homeworks.filter((homework) =>
    homework.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHomeworks = filteredHomeworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <motion.div 
        className=" min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 pt-16 z-100 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
        <nav aria-label="breadcrumb" className="fixed top-16 w-full p-4 backdrop-blur-sm bg-white bg-opacity-70 z-30">
          <div className="container mx-auto flex items-center space-x-2 text-sm text-blue-800">
            <motion.a whileHover={{ scale: 1.05 }} href="/" className="flex items-center hover:underline">
              <FaHome className="mr-1" /> Home
            </motion.a>
            <span>/</span>
            <motion.a whileHover={{ scale: 1.05 }} href="/teacher/dashboard" className="flex items-center hover:underline">
              <FaChalkboardTeacher className="mr-1" /> <span className="font-semibold">Dashboard</span>
            </motion.a>
          </div>
        </nav>

        <motion.div 
          className="relative z-10 container mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8">
            <motion.h1 
              className="flex items-center text-3xl font-bold mb-6 text-blue-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-6 bg-blue-800 mr-3 flex-shrink-0"></div>
              <h1 className="text-2xl font-bold text-blue-800">
              Teacher Dashboard
              </h1>
            </motion.h1>

            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0"
              variants={itemVariants}
            >
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search homework by title..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <motion.button
                onClick={() => router.push("/teacher/manage/add")}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="mr-2" /> Add Homework
              </motion.button>
            </motion.div>

            <motion.div 
              className="overflow-x-auto"
              variants={itemVariants}
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentHomeworks.map((homework) => (
                      <motion.tr 
                        key={homework.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="p-3">{homework.title}</td>
                        <td className="p-3 max-w-xs truncate">{homework.description}</td>
                        <td className="p-3">{new Date(homework.dueDate).toLocaleDateString()}</td>
                        <td className="p-3">{homework.category?.name || "No Category"}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => router.push(`/teacher/manage/edit/${homework.id}`)}
                              className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEdit />
                              <span className="sr-only">Edit</span>
                            </motion.button>
                            <motion.button
                              onClick={() => confirmDelete(homework.id)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaTrashAlt />
                              <span className="sr-only">Delete</span>
                            </motion.button>
                            <motion.button
                              onClick={() => router.push(`/teacher/manage/view/${homework.id}`)}
                              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEye />
                              <span className="sr-only">View</span>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            <motion.div 
              className="mt-6 flex justify-center"
              variants={itemVariants}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showDeleteModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-lg p-8 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this homework?</p>
            <div className="flex justify-end space-x-4">
              <motion.button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}