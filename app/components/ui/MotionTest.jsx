"use client";

import React from 'react';
// Try different import approaches
import { motion } from 'motion';
// import * as Motion from 'motion';
// import motion from 'motion';

export default function MotionTest() {
  // Log to check if motion.div exists
  console.log('Motion library:', motion);
  
  try {
    return (
      <div>
        <h2>Motion Test</h2>
        {/* Try using motion components */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          This is a test motion div
        </motion.div>
      </div>
    );
  } catch (error) {
    // Fallback if motion components aren't working
    console.error('Motion error:', error);
    return (
      <div>
        <h2>Motion Test (Error)</h2>
        <p>Error using motion: {error.message}</p>
      </div>
    );
  }
}
