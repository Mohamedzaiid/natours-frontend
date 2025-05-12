'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const Avatar = ({ 
  src, 
  alt = 'User', 
  size = 'md',
  className = '',
  fallbackInitial = true 
}) => {
  const [error, setError] = useState(false);
  
  // Properly format image source
  const getImageSrc = () => {
    if (!src) return null;
    
    if (src.startsWith('http')) {
      return src;
    } else if (src.startsWith('/')) {
      // Local path starting with /
      return src;
    } else {
      // User photo from API - Always use the direct URL
      return `https://natours-yslc.onrender.com/img/users/${src}`;
    }
  };
  // Size mappings
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
    '2xl': 'h-32 w-32'
  };
  
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  // Get first letter of name for fallback
  const getInitial = () => {
    if (!alt || alt === 'User') return 'U';
    return alt.charAt(0).toUpperCase();
  };
  
  // Generate background color based on name
  const generateColor = () => {
    if (!alt || alt === 'User') return 'bg-green-600';
    
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-yellow-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-red-600',
      'bg-teal-600'
    ];
    
    const charCode = alt.charCodeAt(0);
    return colors[charCode % colors.length];
  };
  
  if (error || !src) {
    if (fallbackInitial) {
      return (
        <div 
          className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold ${generateColor()} ${className}`}
        >
          {getInitial()}
        </div>
      );
    }
    
    // Default fallback image
    return (
      <div className={`${sizeClass} relative rounded-full overflow-hidden ${className}`}>
        <Image
          src="/img/users/default-user.jpg"
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    );
  }
  
  const formattedSrc = getImageSrc();
  
  return (
    <div className={`${sizeClass} relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={formattedSrc}
        alt={alt}
        fill
        onError={() => setError(true)}
        className="object-cover"
      />
    </div>
  );
};

export default Avatar;