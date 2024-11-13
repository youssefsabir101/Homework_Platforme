"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useAnimation } from "framer-motion";
import { FaChalkboardTeacher, FaEye, FaPaperPlane, FaPlay, FaEnvelope, FaExclamationTriangle, FaLightbulb } from "react-icons/fa";
import Image from 'next/image';

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

const SectionTitle = ({ children }) => (
  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">{children}</h2>
);

const ImageComponent = ({ src, alt, className, style, initial, animate, transition }) => (
  <motion.img
    src={src}
    alt={alt}
    className={className}
    style={style}
    initial={initial}
    animate={animate}
    transition={transition}
  />
);

const features = [
  {
    icon: FaChalkboardTeacher,
    title: "Effortless Homework Management",
    description: "Teachers can easily add, edit, and delete homework assignments for their students.",
    color: "text-orange-500",
  },
  {
    icon: FaEye,
    title: "Real-Time Homework Access",
    description: "Students can view homework assigned by their teachers directly from their dashboard.",
    color: "text-blue-500",
  },
  {
    icon: FaPaperPlane,
    title: "Homework Submission",
    description: "Students can submit their homework responses, and teachers can review and track submissions.",
    color: "text-green-500",
  },
];


export default function Home() {
  const { scrollYProgress } = useScroll();
  const scrollY = useSpring(scrollYProgress);
  const yProgress = useTransform(scrollY, [0, 1], [0, 300]);
  const opacityProgress = useTransform(scrollY, [0, 0.5], [1, 0]);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [controls]);

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <div className="w-full font-sans text-gray-900 bg-gradient-to-b from-blue-100 to-white overflow-hidden">
      {/* Background Squares */}
      <BackgroundSquare className="bg-pink-500 top-1/2 left-1/2 z-0" initialX={0} initialY={0} direction="up" />
      <BackgroundSquare className="bg-red-500 top-3/4 right-1/2 z-0" initialX={600} initialY={-50} direction="down" />
      <BackgroundSquare className="bg-yellow-500 top-1/4 right-1/4 z-0" initialX={300} initialY={-50} direction="left" />
      <BackgroundSquare className="bg-yellow-800 top-1/4 right-1/4 z-0" initialX={1000} initialY={-10} direction="left" />
      <BackgroundSquare className="bg-purple-500 bottom-1/4 left-1/4 z-0" initialX={-300} initialY={-100} direction="right" />
      <BackgroundSquare className="bg-purple-500 bottom-1/4 left-1/4 z-0" initialX={-900} initialY={-20} direction="up" />

      {/* Hero Section */}
      <motion.section
        className="relative z-10 min-h-screen flex items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0"
              style={{ opacity: opacityProgress }}
            >
              <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display mb-8 leading-tight">
                <span className="text-blue-600">Wajibati</span>{" "}
                L<span className="text-blue-600">'</span>apprentissage simplifié<span className="text-blue-600">.</span>{" "}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-500 md:max-w-md mb-10">
                Simplifiez l'étude à domicile pour tous
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.button
                  className="flex justify-center items-center py-3 px-8 sm:px-10 text-base sm:text-lg font-bold tracking-wide leading-7 text-white bg-blue-600 rounded-xl hover:shadow-xl w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  className="flex items-center text-base sm:text-lg w-full sm:w-auto justify-center sm:justify-start"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="text-xl sm:text-2xl drop-shadow-lg hover:drop-shadow-xl" />
                  <span className="pl-4 font-bold tracking-wide">Learn how to use it</span>
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px]"
              style={{ y: yProgress }}
            >
              <ImageComponent
                src="/img/vec1.png"
                alt="Productivity Illustration 1"
                className="absolute w-full h-auto top-0 left-0 z-20"
                style={{ rotate: -5 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <ImageComponent
                src="/img/vec2.png"
                alt="Productivity Illustration 2"
                className="absolute w-5/6 h-auto bottom-0 right-0 z-10"
                style={{ rotate: 5 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <ImageComponent
                src="/img/vec3.png"
                alt="Productivity Illustration 3"
                className="absolute w-2/3 h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How to Use Section */}
      <motion.section
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto">
          <SectionTitle>How to Use Our App</SectionTitle>
          <div className="flex flex-col md:flex-row items-stretch gap-12">
            <motion.div
              className="w-full md:w-1/2 flex flex-col justify-center"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-6">Get Started in Minutes</h3>
              <p className="text-xl text-gray-700 mb-6">
                Our homework platform is built for simplicity and efficiency, helping both students and teachers get up and running in no time. Follow these simple steps:
              </p>

              <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2 mb-8">
                {/* For Students */}
                <li>
                  <span className="font-bold">Students:</span> 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                    <li>Click the <span className="font-semibold">"Login"</span> button to access the login page.</li>
                    <li>Enter your <span className="font-semibold">Massar Code</span> and <span className="font-semibold">Password</span> provided by the administration.</li>
                    <li>Once logged in, you’ll be directed to your <span className="font-semibold">Homework Page</span> where you can view and submit assignments.</li>
                  </ul>
                </li>

                {/* For Teachers */}
                <li>
                  <span className="font-bold">Teachers:</span> 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                    <li>Click the <span className="font-semibold">"Login"</span> button to access the login page.</li>
                    <li>Enter your <span className="font-semibold">Email</span> and <span className="font-semibold">Password</span> to log in.</li>
                    <li>After logging in, you'll be directed to your <span className="font-semibold">Dashboard</span> where you can manage homework and view submissions.</li>
                  </ul>
                </li>
              </ol>


            </motion.div>
            <motion.div
              className="w-full md:w-1/2 flex items-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full h-0 pb-[56.25%] relative">
                <iframe
                  src="https://www.youtube.com/embed/97dpHtrCbSQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About App Section */}
      <motion.section
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto">
          <SectionTitle>About Our App</SectionTitle>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/img/vec3.png"
                alt="App Screenshot"
                width={600}
                height={400}
                className="rounded-xl "
              />
            </motion.div>
            <motion.div
              className="w-full md:w-1/2"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl text-gray-700 mb-6">
                Our platform is dedicated to revolutionizing the way homework is managed in schools. Built with both students and teachers in mind, we provide a seamless experience for organizing, submitting, and tracking assignments.
              </p>
              <p className="text-xl text-gray-700">
                We believe in the power of technology to enhance education, enabling teachers to efficiently manage coursework and students to stay on top of their academic responsibilities. Our goal is to create a productive, stress-free environment for academic success, empowering both educators and learners to achieve their full potential.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle>Our Features</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle>Get in Touch</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600 mb-6">We'd love to hear from you</p>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-2">How to Reach Us</h3>
              <p className="text-gray-600 mb-6">We're here to help and improve</p>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your feedback is invaluable to us. Whether you've encountered an issue, have a brilliant idea for a new feature, or simply want to share your thoughts, we're all ears. Here's how you can reach out:
                </p>
                <div className="flex items-start space-x-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Report an Issue:</span>
                    <p className="text-gray-600">Use the form to describe any problems you've encountered. Be as detailed as possible to help us resolve it quickly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FaLightbulb className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Suggest an Improvement:</span>
                    <p className="text-gray-600">Have an idea that could make our app even better? We'd love to hear it! Share your suggestions through the contact form.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FaEnvelope className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">General Inquiries:</span>
                    <p className="text-gray-600">For any other questions or comments, don't hesitate to reach out. We value every piece of feedback from our users.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-3xl font-bold">Our App</h3>
            <p className="text-xl text-gray-400">Boost Your Productivity</p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-8">
              <li><a href="#" className="text-lg hover:text-blue-400 transition duration-300">Home</a></li>
              <li><a href="#" className="text-lg hover:text-blue-400 transition duration-300">About</a></li>
              <li><a href="#" className="text-lg hover:text-blue-400 transition duration-300">Features</a></li>
              <li><a href="#" className="text-lg hover:text-blue-400 transition duration-300">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 text-center text-gray-400">
          <p className="text-lg">&copy; {new Date().getFullYear()} Our App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}