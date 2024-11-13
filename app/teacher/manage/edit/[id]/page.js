"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from 'framer-motion';
import { FaHome, FaChalkboardTeacher, FaEdit, FaUpload, FaFile, FaImage, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function EditHomework() {
  const { id: homeworkId } = useParams();
  const [homework, setHomework] = useState({
    title: "",
    description: "",
    dueDate: "",
    categoryId: "",
    file: null,
    fileUrl: "",
    fileName: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
    async function fetchHomework() {
      try {
        const response = await fetch(`/api/assignments/${homeworkId}`);
        const data = await response.json();
        setHomework({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.split("T")[0],
          categoryId: data.categoryId,
          file: null,
          fileUrl: data.fileUrl || "",
          fileName: data.fileName || "",
        });
      } catch (err) {
        setError("Failed to fetch homework data.");
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchHomework();
    fetchCategories();
  }, [homeworkId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHomework((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setHomework((prev) => ({
      ...prev,
      file: file,
      fileName: file ? file.name : prev.fileName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", homework.title);
    formData.append("description", homework.description);
    formData.append("dueDate", homework.dueDate);
    formData.append("categoryId", homework.categoryId);
    formData.append("teacherId", userId);
    if (homework.file) {
      formData.append("file", homework.file);
    }

    try {
      const response = await fetch(`/api/assignments/edit/${homeworkId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update homework");
      }

      setMessage("Homework updated successfully!");

      setTimeout(() => {
        router.push("/teacher/dashboard");
      }, 2000);
    } catch (err) {
      setMessage("Error updating homework.");
    }
  };

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
        return <FaImage className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

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
          <span className="font-semibold">Edit: {homework.title}</span>
        </div>
      </nav>

      <motion.div 
        className="relative z-10 container mx-auto p-6 max-w-4xl mt-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        

        <motion.form 
          onSubmit={handleSubmit} 
          encType="multipart/form-data"
          className="bg-white p-8 rounded-xl shadow-lg"
          variants={containerVariants}
        >
          <motion.h1 
            className="flex items-center text-3xl font-bold mb-6 text-blue-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-6 bg-blue-800 mr-3 flex-shrink-0"></div>
            <h1 className="text-2xl font-bold text-blue-800">
            Edit Homework
            </h1>
          </motion.h1>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="title" className="block text-gray-700 mb-2 font-semibold">Homework Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={homework.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="description" className="block text-gray-700 mb-2 font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={homework.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="dueDate" className="block text-gray-700 mb-2 font-semibold">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={homework.dueDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="categoryId" className="block text-gray-700 mb-2 font-semibold">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={homework.categoryId}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div className="mb-6" variants={itemVariants}>
            <label htmlFor="file-upload" className="block text-gray-700 mb-2 font-semibold">Current File</label>
            {homework.fileUrl && (
              <div className="mb-4 p-4 border border-gray-300 rounded-lg">
                {homework.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={homework.fileUrl}
                      alt="Current file preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    {getFileIcon(homework.fileName)}
                    <span className="ml-2">{homework.fileName}</span>
                  </div>
                )}
              </div>
            )}
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC, DOCX or TXT (MAX. 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              />
            </label>
            {homework.file && (
              <p className="mt-2 text-sm text-gray-500">Selected file: {homework.file.name}</p>
            )}
          </motion.div>

          {error && (
            <motion.p 
              className="text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p 
              className="text-green-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEdit className="mr-2" /> Update Homework
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}