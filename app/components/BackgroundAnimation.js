// components/BackgroundAnimation.js

"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BackgroundSquare = ({ className, initialX, initialY, direction }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 2], [initialX, initialX + (direction === "left" ? -2000 : 2000)]);
  const y = useTransform(scrollYProgress, [0, 2], [initialY, initialY + (direction === "up" ? -1000 : 1000)]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);

  return (
    <motion.div
      className={`fixed w-60 h-60 rounded-full bg-opacity-50 blur-2xl ${className}`}
      style={{ x, y, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

const BackgroundAnimation = () => (
  <>
    <BackgroundSquare className="bg-blue-500" initialX={-500} initialY={0} direction="left" />
    <BackgroundSquare className="bg-sky-500" initialX={500} initialY={0} direction="right" />
    <BackgroundSquare className="bg-blue-500" initialX={0} initialY={500} direction="up" />
  </>
);

export default BackgroundAnimation;
