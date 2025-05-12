"use client";

import React, { useEffect, useRef } from 'react';
import { X, LogIn, UserPlus, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPromptModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const modalRef = useRef(null);
  
  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Close on Escape key
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Focus trap within modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift+tab and first element is focused, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
        // If tab and last element is focused, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the modal when it opens
    if (isOpen && modalRef.current) {
      // Focus the first button
      const firstButton = modalRef.current.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with fade-in animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal with slide-up animation */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            className={`relative w-full max-w-md overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                : 'bg-white text-gray-900'
            } rounded-2xl shadow-2xl p-0 mx-4`}
          >
            {/* Decorative element - top colored band */}
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600"></div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full z-10
                ${isDark 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                } transition-colors`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            {/* Modal content */}
            <div className="p-6 pt-10">
              {/* Wishlist heart icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center
                  ${isDark
                    ? 'bg-gray-700'
                    : 'bg-emerald-50'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      damping: 10,
                      stiffness: 100,
                      delay: 0.2
                    }}
                  >
                    <Heart 
                      size={40} 
                      className={`${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}
                      fill="currentColor" 
                    />
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 
                  id="auth-modal-title" 
                  className="text-2xl font-bold text-center mb-2"
                >
                  Save to Wishlist
                </h2>
                
                <p className={`mb-8 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Log in to save your favorite tours and create your perfect travel wishlist
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <button
                  onClick={() => {
                    router.push('/login');
                    onClose();
                  }}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                    ${isDark
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90'
                    } transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg`}
                >
                  <LogIn size={18} />
                  <span>Log In</span>
                </button>
                
                <button
                  onClick={() => {
                    router.push('/signup');
                    onClose();
                  }}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                    ${isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-all duration-200 transform hover:translate-y-[-2px]`}
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </button>
                
                <button
                  onClick={onClose}
                  className={`w-full py-3 text-sm font-medium
                    ${isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-gray-800'
                    } transition-colors`}
                >
                  Continue Browsing
                </button>
              </motion.div>
            </div>
            
            {/* Bottom decorative element */}
            <div className={`p-4 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Create an account to sync your wishlist across devices</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptModal;
