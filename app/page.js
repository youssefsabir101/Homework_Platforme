"use client";
import Link from "next/link";
import React, { useEffect,useState ,useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from "framer-motion";
import { FaChalkboardTeacher, FaClipboardList, FaEdit,FaTrash,FaEye,FaFilter,FaPaperPlane, FaPlay, FaEnvelope, FaExclamationTriangle, FaLightbulb , FaLaptop, FaSignInAlt, FaKey, FaGraduationCap, FaTachometerAlt, FaChartLine, FaUsers} from "react-icons/fa";
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
  <>
    <motion.h1 
      className="flex items-center text-3xl font-bold mb-6 text-blue-800"
      initial={{ x: -200, rotateY:-180, opacity: 0 }}
      animate={{ x: 0, rotateY:0, opacity: 1 }}
      transition={{duration:0.8, delay: 0.5 }}
    >
      <div className="w-2 h-8 mr-3 mb-12 md:w-3 md:h-12 bg-blue-500 md:mr-6  md:mb-10 flex-shrink-0"></div>
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 text-blue-500">
      {children}
      </h1>
    </motion.h1>
  </>
  
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




/* about section ======================================================================== */
const getRandomRotation = () => Math.random() < 0.5 ? 5 : -5;

const ImageStack = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotationsRef = useRef(images.map(() => getRandomRotation()));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      rotationsRef.current[currentIndex] = getRandomRotation();
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, [images.length, currentIndex]);

  return (
    <div className="relative w-full h-96">
      <AnimatePresence>
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ 
              x:-500,
              rotate: 35,
              opacity:0
            }}
            animate={{
              x:0,
              opacity:1,
              rotate: index === currentIndex ? 0 : rotationsRef.current[index],
              zIndex: index === currentIndex ? images.length : images.length - index,
            }} 
            transition={{ duration: 0.5 }}
          >
            
              <Image
                src={src}
                alt={`App Screenshot ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon className="text-blue-600 text-2xl" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};
/* ================================================================================ */

//features section
const features = [
  {
    icon: FaClipboardList,
    title: "Homework Management",
    description: "Effortlessly manage homework assignments for your students.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    benefits: [
      "Create new homework assignments",
      "Organize assignments by subject or class",
      "Set due dates and priorities"
    ]
  },
  {
    icon: FaEdit,
    title: "Edit Assignments",
    description: "Easily modify existing homework assignments as needed.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    benefits: [
      "Update assignment details",
      "Adjust due dates",
      "Modify instructions or requirements"
    ]
  },
  {
    icon: FaTrash,
    title: "Delete Homework",
    description: "Remove outdated or cancelled homework assignments.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    benefits: [
      "Quickly delete unnecessary assignments",
      "Bulk delete options for efficiency",
      "Confirmation prompts to prevent accidental deletion"
    ]
  },
  {
    icon: FaEye,
    title: "View Submissions",
    description: "Review and manage student homework submissions.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    benefits: [
      "Access all student submissions in one place",
      "Track submission status and timestamps",
      "Provide feedback on submitted work"
    ]
  },
  {
    icon: FaFilter,
    title: "Filter Homework",
    description: "Students can easily find relevant assignments.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    benefits: [
      "Filter homework by subject or category",
      "Sort assignments by due date",
      "Quick search functionality"
    ]
  },
  {
    icon: FaPaperPlane,
    title: "Submit Homework",
    description: "Students can effortlessly submit their completed assignments.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    benefits: [
      "Easy-to-use submission interface",
      "Support for multiple file formats",
      "Confirmation receipts for successful submissions"
    ]
  }
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scrollY = useSpring(scrollYProgress);
  const yProgress = useTransform(scrollY, [0, 1], [0, -3000]);
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



  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const images = [
    '/img/a.png',
    '/img/b.png',
    '/img/c.png',
    '/img/d.png',
    '/img/e.png',
  ];

  return (
    <div className="w-full font-sans text-gray-900 bg-gradient-to-b from-blue-100 to-white overflow-hidden">
      {/* Background Squares */}
      <BackgroundSquare className="bg-blue-500 top-1/2 left-1/2 z-0" initialX={0} initialY={0} direction="up" />
      <BackgroundSquare className="bg-sky-500 top-3/4 right-1/2 z-0" initialX={600} initialY={-50} direction="down" />
      <BackgroundSquare className="bg-sky-500 top-1/4 right-1/4 z-0" initialX={300} initialY={-50} direction="left" />
      <BackgroundSquare className="bg-blue-800 top-1/4 right-1/4 z-0" initialX={1000} initialY={-10} direction="left" />
      <BackgroundSquare className="bg-sky-500 bottom-1/4 left-1/4 z-0" initialX={-300} initialY={-100} direction="right" />
      <BackgroundSquare className="bg-indigo-500 bottom-1/4 left-1/4 z-0" initialX={-900} initialY={-20} direction="up" />

      {/* Hero Section */}
      <section id="home-page" className="relative z-10 min-h-screen flex items-center">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display mb-8 leading-tight">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -500 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0 }}
                >
                  <span className="text-blue-600">Wajibati</span>{" "}
                </motion.span>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -500 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  L<span className="text-blue-600">'</span>apprentissage{" "}
                </motion.span>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -500 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  simplifié<span className="text-blue-600">.</span>
                </motion.span>
              </h1>
              <motion.p
                className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-500 md:max-w-md mb-10"
                initial={{ opacity: 0, x: -500 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Simplifiez l'étude à domicile pour tous
              </motion.p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div
                  initial={{ opacity: 0, x: -500 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}>
                  <Link href="/login"
                    className="flex justify-center items-center py-3 px-8 sm:px-10 text-base sm:text-lg font-bold tracking-wide leading-7 text-white bg-blue-600 rounded-md hover:bg-blue-800 w-full sm:w-auto transition duration-400 ease-in-out"
                    >
                    <button className="" >
                      Sign In
                    </button>
                  </Link>
                </motion.div>
                
                <motion.button
                  className="flex items-center text-base sm:text-lg w-full sm:w-auto justify-center sm:justify-start"
                  initial={{ opacity: 0, x: -500 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Link href="#how-to-use">
                    <span className="flex items-center py-0 px-4 text-sm hover:bg-blue-600 hover:text-white rounded-md group transition duration-500 ease-in-out">
                      <FaPlay className="text-xl sm:text-2xl drop-shadow-lg mr-2 text-blue-600 group-hover:text-white" />
                      <span className="font-bold tracking-wide text-blue-600 p-4 group-hover:text-white">Learn how to use it</span>
                    </span>
                  </Link>
                </motion.button>
              </div>
            </div>
            <div 
              className="w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px]"
            >
              <ImageComponent
                src="/img/vec4.png"
                alt="Productivity Illustration 1"
                width={500}
                height={500}
                className="absolute w-full md:ml-32 h-auto top-0 left-0 z-20"
                style={{ rotate: -5 }}
                initial={{ opacity: 0, x: 1000 ,rotate: 180}}
                animate={{ opacity: 1, x: 0 ,rotate: 0}}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <motion.section
        id="how-to-use"
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
                Our homework platform is built for simplicity and efficiency. Follow these simple steps:
              </p>

              <div className="relative pl-8">
                <motion.div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500"
                  initial={{ x: -1000, rotate : 180 }}
                  animate={{ x: 0, rotate :0 }}
                  transition={{ duration: 1.8 }}
                ></motion.div>
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, x: -250 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 rounded-full p-2 mr-4">
                      <FaSignInAlt className="text-white text-xl" />
                    </div>
                    <h4 className="text-2xl font-semibold">Login</h4>
                  </div>
                  <p className="text-gray-700 ml-12">
                    Click the "Login" button to access the login page.
                  </p>
                </motion.div>

                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, x: -250 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 rounded-full p-2 mr-4">
                      <FaKey className="text-white text-xl" />
                    </div>
                    <h4 className="text-2xl font-semibold">Enter Credentials</h4>
                  </div>
                  <ul className="text-gray-700 ml-12 space-y-2">
                    <li>
                      <span className="font-semibold">Students:</span> Enter your Massar Code and Password
                    </li>
                    <li>
                      <span className="font-semibold">Teachers:</span> Enter your Email and Password
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -250 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 rounded-full p-2 mr-4">
                      <FaTachometerAlt className="text-white text-xl" />
                    </div>
                    <h4 className="text-2xl font-semibold">Access Dashboard</h4>
                  </div>
                  <ul className="text-gray-700 ml-12 space-y-2">
                    <li>
                      <span className="font-semibold">Students:</span> View your Homework Page
                    </li>
                    <li>
                      <span className="font-semibold">Teachers:</span> Manage homework and view submissions
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 flex items-center"
              initial={{ x: 800, rotate :90, opacity: 0 }}
              animate={{ x: 0, rotate :0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
        id="about-app"
        className="relative z-10 py-20 px-6 "
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
        <SectionTitle>About the App</SectionTitle>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <ImageStack images={images} />
            </motion.div>
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <FeatureItem
                  icon={FaGraduationCap}
                  title="Empowering Students"
                  description="Our platform helps students stay organized and on top of their assignments, promoting academic success."
                />
                <FeatureItem
                  icon={FaChalkboardTeacher}
                  title="Supporting Teachers"
                  description="We provide tools for teachers to efficiently manage coursework and track student progress."
                />
                <FeatureItem
                  icon={FaLaptop}
                  title="Seamless Technology"
                  description="Our user-friendly interface ensures a smooth experience for both students and educators."
                />
                <FeatureItem
                  icon={FaChartLine}
                  title="Performance Tracking"
                  description="Easily monitor academic progress and identify areas for improvement."
                />
                <FeatureItem
                  icon={FaUsers}
                  title="Collaborative Learning"
                  description="Foster communication between students and teachers, enhancing the learning experience."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle>Application Features</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white bg-opacity-70 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transform"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle>Get in Touch</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md"
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
              className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md"
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
                  <FaExclamationTriangle className="text-blue-500 mt-1 flex-shrink-0" />
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
                  <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
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
      
      <footer className="relative text-white">
        <div className="mt-6 pt-32 pb-8 px-6 border-none bg-gradient-to-t from-[#0071f39a]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-3xl font-bold text-blue-600">Wajibati</h3>
              <p className="text-xl text-gray-200">apprentissage simplifié</p>
            </div>
            
            <div className="mt-6 md:mt-0 text-center">
              <p className="text-lg text-gray-200">&copy; {new Date().getFullYear()} sabir. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}