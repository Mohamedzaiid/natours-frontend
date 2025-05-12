'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const Card = ({ 
  title, 
  description, 
  children, 
  actionUrl, 
  actionText = 'View All',
  className = '', 
  bodyClassName = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${className}`}>
      {(title || actionUrl) && (
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          {actionUrl && (
            <Link href={actionUrl} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center transition-colors">
              {actionText}
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          )}
        </div>
      )}
      
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
