"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  ArrowUpRight,
  Map,
} from "lucide-react";
import { motion } from '@/lib/animations/motion';
import { useState } from "react";
import { useInView } from "@/lib/animations/useInView";
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import WishlistButton from "@/app/components/ui/wishlist/WishlistButton";

export const TourCard = ({ tour, className }) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Force rendering regardless of InView status for better reliability
  const forceRender = true;
  const {
    id,
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage,
    ratingsQuantity,
    price,
    summary,
    imageCover,
    startLocation,
    startDates,
  } = tour;

  // Format start date
  const formatDate = (dateString) => {
    if (!dateString) return "Flexible dates";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nextStartDate =
    startDates && startDates.length > 0
      ? formatDate(startDates[0])
      : "Flexible dates";

  // Calculate discount if available
  const hasDiscount = tour.priceDiscount && tour.priceDiscount > 0;
  const discountPercentage = hasDiscount
    ? Math.round(((tour.price - tour.priceDiscount) / tour.price) * 100)
    : 0;
    
  // Handle missing image URLs
  const coverImage = imageCover || `/img/tours/Hiking.jpg`;
  
  // Log tour data for debugging
  console.log(`Rendering tour card for: ${name}`, { id, imageCover: coverImage });

  return (
    <motion.div 
      ref={ref}
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${className || ''} ${isDark ? 'dark-tour-card' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Section with overlay */}
      <div className="relative h-60 w-full overflow-hidden">
        <motion.div
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <Image
            src={coverImage}
            alt={name}
            fill
            unoptimized={true}
            className="object-cover transition-transform"
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Badge */}
        {hasDiscount && (
          <motion.div 
            className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Save {discountPercentage}%
          </motion.div>
        )}

        {/* Wishlist button */}
        <motion.div 
          className="absolute top-4 right-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <WishlistButton tour={tour} />
        </motion.div>

        {/* Location pill */}
        <motion.div 
          className={`absolute bottom-4 left-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-white/90 text-gray-800'} backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={forceRender || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <MapPin size={14} className="text-emerald-600" />
          <span className="font-medium">
            {startLocation?.description || "Tour Location"}
          </span>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Rating & Difficulty */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(ratingsAverage)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-1 text-xs text-gray-500">
              ({ratingsQuantity || 0})
            </span>
          </div>
          <span
            className={`text-xs uppercase tracking-wider font-medium px-2.5 py-1 rounded-full ${isDark ? (
              difficulty === "easy"
                ? "bg-green-900 text-green-300"
                : difficulty === "medium"
                ? "bg-blue-900 text-blue-300"
                : "bg-orange-900 text-orange-300"
            ) : (
              difficulty === "easy"
                ? "bg-green-100 text-green-800"
                : difficulty === "medium"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            )}`}
          >
            {difficulty}
          </span>
        </div>

        {/* Title */}
        <Link href={`/tours/${id}`}>
          <h3 className={`text-lg font-bold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-800'} hover:text-emerald-600 transition-colors group-hover:text-emerald-600`}>
            {name}
          </h3>
        </Link>

        {/* Summary */}
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>{summary}</p>

        {/* Features with fancy icons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} flex items-center justify-center`}>
              <Clock size={15} className="text-emerald-600" />
            </div>
            <span>{duration} days</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} flex items-center justify-center`}>
              <Users size={15} className="text-emerald-600" />
            </div>
            <span>Max {maxGroupSize}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} flex items-center justify-center`}>
              <Map size={15} className="text-emerald-600" />
            </div>
            <span className="capitalize">{difficulty}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} flex items-center justify-center`}>
              <Calendar size={15} className="text-emerald-600" />
            </div>
            <span className="truncate">{nextStartDate}</span>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} my-4`}></div>

        {/* Price and Button */}
        <div className="flex justify-between items-center h-14">
          <div className="flex flex-col justify-center">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-emerald-600">
                  ${tour.priceDiscount}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ${price}
                </span>
              </div>
            ) : (
              <span className="font-bold text-xl text-emerald-600">
                ${price}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">per person</span>
          </div>
          <Link href={`/tours/${id}`}>
            <motion.button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-5 rounded-full transition-colors flex items-center gap-2 h-10 w-34 justify-center"
              whileHover={{ scale: 1.05, backgroundColor: "#047857" }}
              whileTap={{ scale: 0.95 }}
            >
              View Tour
              <motion.div
                animate={isHovered ? { x: 3 } : { x: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
              >
                <ArrowUpRight size={15} />
              </motion.div>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;