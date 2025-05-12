/**
 * Re-export motion from the correct path to ensure consistent usage
 * This solves the issue with motion.div not being found
 */

import { motion, AnimatePresence } from 'motion/react';

export { motion, AnimatePresence };
