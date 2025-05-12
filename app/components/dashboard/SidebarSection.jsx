'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const SidebarSection = ({ 
  title, 
  icon, 
  children,
  defaultOpen = true,
  collapsible = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      {title && (
        <div 
          className={`flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 ${collapsible ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 mb-1' : ''}`}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <span>{title}</span>
          </div>
          {collapsible && (
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
            />
          )}
        </div>
      )}
      
      {isOpen && (
        <div className="mt-2 space-y-1 px-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
