"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { motion } from '@/lib/animations/motion';
import { useInView } from '@/lib/animations/useInView';

import { useTheme } from '@/app/providers/theme/ThemeProvider';
import ModernChatModal from './ModernChatModal';

export function CTASection({ title, subtitle, ctaText, ctaLink }) {
  const { isDark } = useTheme();
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: '',
    destination: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const benefits = [
    "Expertly curated itineraries",
    "Small groups for personalized experiences",
    "Professional, knowledgeable guides",
    "Environmental conservation focus",
    "No hidden fees or surprises",
    "24/7 customer support"
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Open chat modal with form data
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative py-20 bg-emerald-700 text-white overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 0 L20 0 L20 20 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </motion.div>

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
            <p className="text-emerald-100 text-lg mb-8">{subtitle}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <CheckCircle size={20} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={ctaLink || "/tours"}>
                <button className="px-8 py-4 bg-white text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                  {ctaText || "Explore Our Tours"}
                </button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Form */}
          <motion.div 
            className={`bg-white rounded-xl shadow-xl p-6 text-gray-800 ${isDark ? 'dark-cta-form' : 'light-cta-form'}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Get AI Travel Recommendations</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Smith"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      formErrors.destination ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Where would you like to go?"
                  />
                  {formErrors.destination && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.destination}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-slate-700 mb-1">
                    Travel Interests
                  </label>
                  <select
                    id="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="">Select your interest</option>
                    <option value="Adventure Tours">Adventure Tours</option>
                    <option value="Cultural Experiences">Cultural Experiences</option>
                    <option value="Wildlife & Nature">Wildlife & Nature</option>
                    <option value="Relaxation & Wellness">Relaxation & Wellness</option>
                    <option value="Family-Friendly Tours">Family-Friendly Tours</option>
                  </select>
                </div>
              </div>
              
              <motion.button
                type="submit"
                className="w-full mt-6 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                whileHover={{ backgroundColor: "#047857", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat with AI Travel Concierge
              </motion.button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By submitting this form, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Chat Modal */}
      <ModernChatModal
        userName={formData.name}
        userEmail={formData.email}
        destination={formData.destination}
        travelInterests={formData.interests}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

export default CTASection;