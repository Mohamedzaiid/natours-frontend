"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import AuthPromptModal from '@/app/components/ui/auth/AuthPromptModal';

// Create context
const AuthPromptContext = createContext();

export function AuthPromptProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Show/hide the auth prompt modal
  const toggleAuthPrompt = useCallback((show = true) => {
    setIsOpen(show);
  }, []);
  
  // Close the auth prompt modal
  const closeAuthPrompt = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Context value
  const value = {
    showAuthPrompt: isOpen,
    toggleAuthPrompt,
    closeAuthPrompt
  };
  
  return (
    <AuthPromptContext.Provider value={value}>
      {/* Render modal once for the entire app */}
      <AuthPromptModal 
        isOpen={isOpen} 
        onClose={closeAuthPrompt} 
      />
      {children}
    </AuthPromptContext.Provider>
  );
}

// Custom hook to use the auth prompt context
export function useAuthPrompt() {
  const context = useContext(AuthPromptContext);
  if (context === undefined) {
    throw new Error('useAuthPrompt must be used within an AuthPromptProvider');
  }
  return context;
}
