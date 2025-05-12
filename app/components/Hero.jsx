"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from '@/lib/animations/motion';

import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { fadeIn, slideUp, slideInLeft, slideInRight } from '@/lib/animations/variants';
import ImageCarousel from './ImageCarousel';
import ModernChatModal from './ModernChatModal';

export const Hero = ({ title, subtitle, ctaText, ctaLink }) => {
  const { isDark } = useTheme();
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [people, setPeople] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Hero images for carousel with better quality images
  const heroImages = [
    "/hero-bg.jpg",
    "/img/tours/Mountain.jpg",
    "/img/tours/Beach.jpg"
  ];
  
  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        setScrollY(scrollPosition);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Simulate loading delay for smooth animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (!destination && !dateRange && !people) {
      // Show a notification that fields are empty
      alert('Please fill at least one search field');
      return;
    }

    setIsSearching(true);

    try {
      // Search for tours based on criteria
      const response = await fetch('/api/tours/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          dateRange,
          people: people ? parseInt(people, 10) : undefined,
        }),
      });

      const data = await response.json();
      setSearchResults(data.results);

      // Always open the AI chat with advanced suggestions
      setIsModalOpen(true);
      
      // If there are results, also redirect to search results page in background
      // if (data.results && data.results.length > 0) {
      //   // Instead of redirecting immediately, let AI assist with planning first
      //   // and open a new tab with search results
      //   setTimeout(() => {
      //     const searchUrl = `/tours?destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(dateRange)}&people=${encodeURIComponent(people)}`;
      //     window.open(searchUrl, '_blank');
      //   }, 1000);
      // }
    } catch (error) {
      console.error('Error searching tours:', error);
      // If error occurs, still offer AI assistance
      setIsModalOpen(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden" ref={heroRef}>
      {/* Background Image Carousel with Parallax */}
      <motion.div 
        style={{ 
          y: scrollY * 0.2, // Parallax effect - move background slower than scroll
          scale: 1 + (scrollY * 0.0005) // Subtle zoom effect on scroll
        }}
        className="absolute inset-0 z-0"
      >
        <ImageCarousel 
          images={heroImages}
          interval={5000}
          overlay="bg-black/40"
          autoPlay={true}
        />
      </motion.div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center text-white"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={slideUp}
              initial="initial"
              animate={loaded ? "animate" : "initial"}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              variants={slideUp}
              initial="initial"
              animate={loaded ? "animate" : "initial"}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>

            {/* Search Box */}
            <motion.div 
              className={`bg-white rounded-2xl shadow-xl p-4 md:p-6 max-w-4xl mx-auto text-left ${isDark ? 'dark-search-box' : ''}`}
              variants={slideUp}
              initial="initial"
              animate={loaded ? "animate" : "initial"}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                y: -5
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Destination
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      className="flex-1 outline-none text-gray-800 text-sm bg-transparent"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="When are you going?"
                      className="flex-1 outline-none text-gray-800 text-sm bg-transparent"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Travelers
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                    <Users size={18} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="How many people?"
                      className="flex-1 outline-none text-gray-800 text-sm bg-transparent"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <motion.button 
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03, backgroundColor: '#057a55' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} className="mr-2" />
                    Search Tours
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Featured Categories */}
            <motion.div 
              className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
              variants={fadeIn}
              initial="initial"
              animate={loaded ? "animate" : "initial"}
              transition={{ delay: 0.5 }}
            >
              {[
                { name: "Adventure", icon: "🏕️" },
                { name: "Cultural", icon: "🏛️" },
                { name: "Wildlife", icon: "🦁" },
                { name: "Beach", icon: "🏝️" },
                { name: "City Break", icon: "🏙️" },
                { name: "Mountain", icon: "⛰️" },
              ].map((category, index) => (
                <Link
                  href={`/tours?category=${category.name.toLowerCase()}`}
                  key={category.name}
                >
                  <motion.div 
                    className={`bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 text-center transition-all cursor-pointer shadow-smooth hover-lift hover-glow ${isDark ? 'dark-featured-category' : ''}`}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      y: -5,
                      transition: { duration: 0.2, type: "spring" }
                    }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 + 0.6, duration: 0.25 }}
                  >
                    <motion.div 
                      className="text-2xl mb-2"
                      animate={{ 
                        y: [0, -5, 0],
                        transition: { 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 2,
                          delay: index * 0.2
                        }
                      }}
                    >
                      {category.icon}
                    </motion.div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <ModernChatModal
        userName={userName || 'Guest'}
        userEmail={userEmail || 'guest@example.com'}
        destination={destination}
        travelInterests={''}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        searchCriteria={{
          destination,
          dateRange,
          people
        }}
        searchResults={searchResults}
        isFromSearch={true}
      />
    </div>
  );
};

export default Hero;