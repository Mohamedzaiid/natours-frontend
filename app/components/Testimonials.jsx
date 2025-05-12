"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from '@/lib/animations/motion';

import { useInView } from '@/lib/animations/useInView';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://natours-yslc.onrender.com/img/users/user-2.jpg",
      role: "Adventure Enthusiast",
      location: "California, USA",
      text: "The Forest Hiker tour exceeded all my expectations! Our guide was incredibly knowledgeable and the natural beauty was breathtaking. I've already booked my next trip with Natours!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://natours-yslc.onrender.com/img/users/user-1.jpg",
      role: "Travel Blogger",
      location: "Toronto, Canada",
      text: "As someone who's traveled extensively, I can confidently say that Natours provides some of the best guided tour experiences available. The Sea Explorer tour was well-organized and perfectly paced.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Roberts",
      avatar: "https://natours-yslc.onrender.com/img/users/user-3.jpg",
      role: "Photography Enthusiast",
      location: "London, UK",
      text: "The Snow Adventurer tour provided countless photo opportunities. Our guide knew exactly where to take us for the best shots, and the group size was perfect - not too large or small.",
      rating: 4,
    },
    {
      id: 4,
      name: "Maria Muller",
      avatar: "https://natours-yslc.onrender.com/img/users/user-8.jpg",
      role: "Hiking Enthusiast",
      location: "Berlin, Germany",
      text: "I was initially hesitant about joining a guided tour, but Natours completely changed my perspective. The attention to detail, comfortable accommodations, and breath-taking trails made this an unforgettable experience.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };
  
  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <motion.div 
      ref={ref}
      className="py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="section-title">What Our Travelers Say</h2>
        <p className="section-subtitle mx-auto">
          Authentic reviews from adventurers who've experienced our tours
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        <div className="grid md:grid-cols-5">
          {/* Image Section - Hidden on Mobile */}
          <div className="hidden md:block md:col-span-2 relative">
            <div className="absolute inset-0 bg-emerald-600">
              <Image
                src="/img/tours/Hiking.jpg"
                alt="Happy travelers"
                fill
                className="object-cover mix-blend-overlay opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                <Quote size={60} className="opacity-20 mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Customer Satisfaction
                </h3>
                <p className="text-lg mb-6">
                  Over 95% of our travelers rate their experience as excellent
                </p>
                <motion.div 
                className="flex space-x-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </motion.svg>
                ))}
              </motion.div>
              </div>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="md:col-span-3 p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {currentTestimonial.name}
                  </h3>
                  <div className="text-gray-600 text-sm">
                    {currentTestimonial.role} • {currentTestimonial.location}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      i < currentTestimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } fill-current`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="mb-10 overflow-hidden">
              <motion.div 
                className="h-10 w-10 text-600/20 mb-4 inline-block"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <Quote />
              </motion.div>
              
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.p 
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-slate-400 text-lg leading-relaxed"
                >
                  {currentTestimonial.text}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-emerald-600"
                        : "w-2.5 bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Previous testimonial"
                  whileHover={{ scale: 1.1, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Next testimonial"
                  whileHover={{ scale: 1.1, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Testimonials;
