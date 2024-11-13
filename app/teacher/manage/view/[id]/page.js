"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHome, FaChalkboardTeacher, FaEye, FaCalendarAlt, FaFolder, FaUserGraduate, FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';

export default function ViewHomework() {
  const { id: homeworkId } = useParams();
  const [homework, setHomework] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const decodedUserName = decodeURIComponent(getCookie("name") || "");
    const decodedUserRole = getCookie("role") || "";
    const decodedUserId = getCookie("id") || "";

    if (!decodedUserRole || !decodedUserId) {
      router.push("/login");
    } else if (decodedUserRole !== "teacher") {
      router.push("/");
    } else {
      setUserName(decodedUserName);
      setUserRole(decodedUserRole);
      setUserId(decodedUserId);
    }
  }, [router]);

  useEffect(() => {
    if (!homeworkId) {
      setError("Homework ID is missing from the URL.");
      setLoading(false);
      return;
    }

    async function fetchHomeworkDetails() {
      try {
        const response = await fetch(`/api/assignments/${homeworkId}`);
        if (!response.ok) {
          const errorMessage = await response.json();
          setError(`Failed to fetch homework details: ${errorMessage.error}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setHomework(data);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching homework details.");
        console.error("Error fetching homework:", err);
        setLoading(false);
      }
    }

    fetchHomeworkDetails();
  }, [homeworkId]);

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

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFile />;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
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

  if (!homework) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">No homework found</h1>
        <p>The requested homework details could not be found.</p>
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav aria-label="breadcrumb" className="fixed top-16 w-full p-4 backdrop-blur-sm bg-white bg-opacity-70 z-30">
        <div className="container mx-auto flex items-center space-x-2 text-sm text-blue-800">
          <motion.a whileHover={{ scale: 1.05 }} href="/" className="flex items-center hover:underline">
            <FaHome className="mr-1" /> Home
          </motion.a>
          <span>/</span>
          <motion.a whileHover={{ scale: 1.05 }} href="/teacher/dashboard" className="flex items-center hover:underline">
            <FaChalkboardTeacher className="mr-1" /> Dashboard
          </motion.a>
          <span>/</span>
          <span className="font-semibold">View: {homework.title}</span>
        </div>
      </nav>

      <motion.div 
        className="relative z-10 container mx-auto p-6 max-w-4xl mt-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <motion.h1 
            className="flex items-center text-3xl font-bold mb-6  text-blue-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-6 bg-blue-800 mr-3 flex-shrink-0"></div>
            <h1 className="text-2xl font-bold text-blue-800">
            Homework Details
            </h1>
          </motion.h1>
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-center">
              <FaEye className="text-blue-500 mr-2" />
              <div>
                <p className="block text-sm font-medium text-gray-700">Title : <span className="text-sm text-black">{homework.title}</span> </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center">
              <FaFileAlt className="text-blue-500 mr-2 mt-1" />
              <div>
                <p className="block text-sm font-medium text-gray-700">Content : <span className="text-sm text-black">{homework.description}</span> </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <div>
                <p className="block text-sm font-medium text-gray-700">Due Date : <span className="text-sm text-black">{new Date(homework.dueDate).toLocaleDateString()}</span> </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center">
              <FaFolder className="text-blue-500 mr-2" />
              <div>
                  <p className="block text-sm font-medium text-gray-700">Category : <span className="text-sm text-black">{homework.category?.name || "No Category"}</span> </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attached File:</label>
              {homework.fileUrl ? (
                <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                  {homework.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null ? (
                    <div className="relative w-24 h-24 mr-4">
                      <Image
                        src={homework.fileUrl}
                        alt="Homework file preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-4xl mr-4">
                      {getFileIcon(homework.fileName)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{homework.fileName}</p>
                    <a
                      href={homework.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View File
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No file attached</p>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submissions:</label>
              {homework.submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time of Response</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {homework.submissions.map((submission) => (
                        <motion.tr 
                          key={submission.studentId} 
                          className="hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <td className="px-4 py-2 whitespace-nowrap">{submission.studentId}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{submission.student?.name || "N/A"}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{submission.student?.loginCode || "N/A"}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <motion.button
                              onClick={() => router.push(`/teacher/manage/responses/${submission.studentId}?homeworkId=${homeworkId}`)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaUserGraduate className="mr-2" /> View
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-lg text-gray-600 italic">No submissions found for this homework.</p>
              )}
            </motion.div>
          </div>
          <motion.div 
            className="mt-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => router.push("/teacher/dashboard")}
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChalkboardTeacher className="mr-2" /> Back to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}