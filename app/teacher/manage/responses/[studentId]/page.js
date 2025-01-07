"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaFileAlt, FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileName }) => {
  const getFileType = (url) => {
    if (!url) return 'other'; // Check for null or undefined URL
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  const fileType = getFileType(fileUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-4 rounded-lg max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold truncate">{fileName || 'No File'}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              {fileType === 'image' && fileUrl && (
                <Image
                  src={fileUrl}
                  alt={fileName}
                  layout="responsive"
                  width={800}
                  height={600}
                  objectFit="contain"
                />
              )}
              {fileType === 'pdf' && fileUrl && (
                <iframe
                  src={`${fileUrl}#view=FitH`}
                  title={fileName}
                  width="100%"
                  height="100%"
                  className="border-none"
                />
              )}
              {fileType === 'other' && (
                <div className="text-center py-8">
                  <FaFileAlt size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>{fileUrl ? 'Preview not available for this file type.' : 'No file to preview.'}</p>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      Open file in new tab
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default function ViewStudentSubmission() {
  const { studentId } = useParams();
  const searchParams = useSearchParams();
  const homeworkId = searchParams.get("homeworkId");
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    if (!studentId || !homeworkId) {
      setError("Student ID or Homework ID is missing.");
      setLoading(false);
      return;
    }

    async function fetchSubmission() {
      try {
        const response = await fetch(`/api/submissions?studentId=${studentId}&homeworkId=${homeworkId}`);
        if (!response.ok) {
          const errorMessage = await response.json();
          setError(`Failed to fetch submissions: ${errorMessage.error}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setSubmission(data);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching the submission.");
        console.error("Error fetching submission:", err);
        setLoading(false);
      }
    }

    fetchSubmission();
  }, [studentId, homeworkId]);

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


  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = submission.fileUrl;
    link.download = `${submission.studentName}_${submission.homeworkTitle}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden">
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

  if (!submission) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">No submission found</h1>
        <p>No submission found for this homework.</p>
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav aria-label="breadcrumb" className="fixed top-16 w-full p-4 backdrop-blur-sm bg-white bg-opacity-70 z-30">
        <div className="container mx-auto flex items-center space-x-2 text-sm text-blue-500">
          <motion.a whileHover={{ scale: 1.05 }} href="/" className="flex items-center hover:underline">
            <FaHome className="mr-1 text-blue-500" /> Acceuil
          </motion.a>
          <span>/</span>
          <motion.a whileHover={{ scale: 1.05 }} href="/teacher/dashboard" className="flex items-center hover:underline">
            <FaChalkboardTeacher className="mr-1 text-blue-500" /> Dashboard
          </motion.a>
          <span>/</span>
          <span className="font-semibold text-blue-500">Voir la réponse de : {submission.studentName}</span>
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
            className="flex items-center text-3xl font-bold mb-6  text-blue-500"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-6 bg-blue-500 mr-3 flex-shrink-0"></div>
            <h1 className="text-2xl font-bold text-blue-500">
            Les réponses d'étudiant
            </h1>
          </motion.h1>
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-start">
              <FaUserGraduate className="text-blue-500 mr-2 mt-1" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom d'étudiant:</label>
                <p className="text-lg">{submission.studentName}</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start">
              <FaFileAlt className="text-blue-500 mr-2 mt-1" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre de devoirs:</label>
                <p className="text-lg">{submission.homeworkTitle}</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Envoyé à :</label>
                <p className="text-lg">{new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start">
              <FaFileAlt className="text-blue-500 mr-2 mt-1" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Contenu de la réponse :</label>
                <p className="text-lg">{submission.answareText || "No Answer Provided"}</p>
              </div>
            </motion.div>
            {submission.fileUrl && (
              <motion.div variants={itemVariants} className="flex items-start">
                <FaFileAlt className="text-blue-500 mr-2 mt-1" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fichier joint :</label>
                  <p className="text-lg mb-2">{submission.formattedFileName}</p>
                  <div className="flex space-x-4 -ml-6">
                    <motion.button
                      onClick={() => setIsPreviewOpen(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEye className="mr-2" /> Voir
                    </motion.button>
                    <motion.button
                      onClick={handleDownload}
                      className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload className="mr-2" /> Télécharger
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <motion.div 
            className="mt-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => router.back()}
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChalkboardTeacher className="mr-2" /> Retour
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={submission?.fileUrl}
        fileName={submission?.formattedFileName}
      />
    </motion.div>
  );
}