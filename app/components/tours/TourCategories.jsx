'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mountain, Waves, Tree, Compass, Tent, Map } from 'lucide-react';
import { motion } from '@/lib/animations/motion';

export function TourCategories() {
  const categories = [
    {
      name: 'Mountain',
      description: 'Explore majestic peaks and challenging trails',
      icon: <Mountain size={28} className="text-white" />,
      color: 'from-blue-400 to-blue-600',
      href: '/tours?category=mountain',
      count: 14
    },
    {
      name: 'Beach',
      description: 'Relax on beautiful coastlines around the world',
      icon: <Waves size={28} className="text-white" />,
      color: 'from-cyan-400 to-cyan-600',
      href: '/tours?category=beach',
      count: 8
    },
    {
      name: 'Forest',
      description: 'Discover the tranquility of lush forests',
      icon: <Mountain size={28} className="text-white" />,
      color: 'from-green-400 to-green-600',
      href: '/tours?category=forest',
      count: 11
    },
    {
      name: 'Adventure',
      description: 'Thrilling experiences for the bold explorer',
      icon: <Compass size={28} className="text-white" />,
      color: 'from-red-400 to-red-600',
      href: '/tours?category=adventure',
      count: 16
    },
    {
      name: 'Camping',
      description: 'Connect with nature under the stars',
      icon: <Tent size={28} className="text-white" />,
      color: 'from-amber-400 to-amber-600',
      href: '/tours?category=camping',
      count: 7
    },
    {
      name: 'Hiking',
      description: 'Scenic trails for all experience levels',
      icon: <Map size={28} className="text-white" />,
      color: 'from-indigo-400 to-indigo-600',
      href: '/tours?category=hiking',
      count: 12
    }
  ];

  return (
    <div>
      <div className="mb-10 text-center">
        <h2 className="section-title">Find Your Perfect Adventure</h2>
        <p className="section-subtitle text-center mx-auto">
          Explore our diverse range of tour categories to discover your next unforgettable experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link key={index} href={category.href}>
            <motion.div 
              className="relative h-64 overflow-hidden rounded-xl shadow-md transition-all"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                y: -5,
              }} 
              transition={{ duration: 0.2 }}
            >
              {/* Background Image with Gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r w-full h-full"
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image 
                  src={`/img/tours/${category.name}.jpg`} 
                  alt={category.name}
                  fill
                  className="object-cover mix-blend-overlay"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
              </motion.div>
              
              {/* Content */}
              <motion.div 
                className="absolute inset-0 p-6 flex flex-col justify-between z-10"
                initial={{ opacity: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div 
                  className="h-12 w-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center mb-2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {category.icon}
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/90 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                      {category.count} tours
                    </span>
                    <motion.span 
                      className="text-white font-medium"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      Explore →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TourCategories;