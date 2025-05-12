'use client';

import Image from 'next/image';

export const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundImage = '/api/placeholder/1920/400', 
  height = 'h-80',
  overlay = true
}) => {
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className="object-cover"
      />
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black opacity-70"></div>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;