"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {FaHome, FaBook, FaUpload, FaFileAlt, FaFile, FaCalendarAlt, FaUser, FaEye, FaTimes, FaImage, FaVideo, FaMusic } from 'react-icons/fa';
import Image from 'next/image';

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

const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileName }) => {
  const getFileType = (url) => {
    if (!url) return 'other'; // Handle cases where the URL is null or undefined
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
                  <FaFile size={48} className="mx-auto mb-4 text-gray-400" />
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



export default function HomeworkDetail() {
  const { id } = useParams();
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState({
    title: "",
    answer: "",
    file: null,
  });
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const router = useRouter();

  const { scrollY } = useScroll();
  const y = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const containerRef = useRef(null);
  const containerY = useTransform(y, [0, 200], [0, -20]);

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
    } else if (decodedUserRole !== "student") {
      router.push("/");
    } else {
      setUserName(decodedUserName);
      setUserRole(decodedUserRole);
      setUserId(decodedUserId);
    }
  }, [router]);

  useEffect(() => {
    if (!id) return;

    const fetchHomework = async () => {
      try {
        const res = await fetch(`/api/assignments/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch homework details: ${res.statusText}`);
        }
        const data = await res.json();
        setHomework(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSubmission((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);
    setSubmissionSuccess(false);

    if (!submission.file && !submission.answer && !submission.title) {
      setSubmissionError("Please provide a title, answer, or upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("answer", submission.answer);
    formData.append("title", submission.title);
    if (submission.file) {
      formData.append("file", submission.file);
    }

    try {
      const res = await fetch(`/api/assignments/${id}/submit`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to submit: ${res.statusText}`);
      }

      setSubmissionSuccess(true);
      setSubmission({ title: "", answer: "", file: null });
    } catch (err) {
      setSubmissionError(err.message);
    }
  };

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


  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FaFileAlt />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaImage />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaVideo />;
      case 'mp3':
      case 'wav':
        return <FaMusic />;
      default:
        return <FaFile />;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden pt-16 z-100"
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
          <motion.a whileHover={{ scale: 1.05 }} href="/student/homework" className="flex items-center hover:underline">
            <FaBook className="mr-1" /> Homeworks
          </motion.a>
          <span>/</span>
          <span className="font-semibold">{homework?.title}</span>
        </div>
      </nav>

      <motion.div 
        ref={containerRef}
        className="container mx-auto mt-24 p-6 max-w-7xl relative z-10"
        style={{ y: containerY }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg mb-8 lg:mb-0 lg:w-2/3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-6">{homework.title}</h1>
            <p className="text-gray-700 text-lg mb-4">{homework.description}</p>
            <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Due Date: {new Date(homework.dueDate).toLocaleDateString()}
              </div>
              {homework.category && (
                <div className="flex items-center">
                  <FaBook className="mr-2 text-blue-500" />
                  Category: {homework.category.name}
                </div>
              )}
              {homework.teacher && (
                <div className="flex items-center">
                  <FaUser className="mr-2 text-blue-500" />
                  Created by: {homework.teacher.name}
                </div>
              )}
            </div>

            <motion.div 
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-2">Attached File</h3>
              {homework.fileUrl ? (
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-4 overflow-hidden">
                    {getFileIcon(homework.fileUrl.split('.').pop())}
                    <span className="ml-2 truncate">{homework.fileUrl.split('/').pop()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      onClick={() => setIsPreviewOpen(true)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEye className="mr-2" />
                      View File
                    </motion.button>
                    <motion.a
                      href={homework.fileUrl}
                      download
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFileAlt className="mr-2" />
                      Download File
                    </motion.a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No file attached to this homework.</p>
              )}
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-white p-8 w-full rounded-xl shadow-lg lg:w-1/3 lg:sticky lg:top-24 lg:self-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              position: 'sticky',
              top: '80px', // Adjust this value to account for the height of your navigation bar
              alignSelf: 'flex-start'
            }}
          >
            <h2 className="text-2xl font-bold mb-6">Submit Your Answer</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">Exercise/Series Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={submission.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your Exercise/Series Title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="answer" className="block text-gray-700 mb-2">Your Answer</label>
                <textarea
                  id="answer"
                  name="answer"
                  value={submission.answer}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your answer here..."
                  rows="6"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="file-upload" className="block text-gray-700 mb-2">Upload an Image or PDF (optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="w-8 h-8 mb-3 text-blue-400" />
                      <p className="mb-2 text-sm text-blue-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-blue-500">PDF, JPG, PNG, DOC, DOCX or TXT (MAX. 10MB)</p>
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
                </div>
              </div>
              {submissionError && (
                <motion.p 
                  className="text-red-500 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {submissionError}
                </motion.p>
              )}
              {submissionSuccess && (
                <motion.p 
                  className="text-green-500 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Submission  successful!
                </motion.p>
              )}
              <motion.button
                type="submit"
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUpload className="mr-2" />
                Submit
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={homework?.fileUrl}
        fileName={homework?.fileUrl?.split('/').pop()}
      />
    </motion.div>
  );
}