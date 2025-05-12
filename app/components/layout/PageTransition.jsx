"use client";

import React from 'react';
import { motion } from 'motion/react';
import { pageTransition } from "@/lib/animations/variants";

/**
 * Page transition component that wraps page content
 * Provides smooth animations between page navigation
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.className - Optional additional CSS classes
 */
export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}
