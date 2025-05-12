"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import useSearchSuggestions from "@/app/hooks/useSearchSuggestions";
import SearchResults from "./SearchResults";
import { useTheme } from "@/app/providers/theme/ThemeProvider";

const SearchBar = ({ isAuthPage = false, isScrolled = false }) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();
  const { isDark } = useTheme();
  
  // Custom hook for search suggestions with debounce
  const { suggestions, loading, error } = useSearchSuggestions(query);
  
  // Get dynamic styling based on state
  const getIconColor = () => {
    if (isDark) {
      return "text-white";
    }
    
    if (isScrolled) {
      return "text-slate-700";
    }
    
    if (isAuthPage) {
      return "text-slate-700";
    }
    
    return "text-white";
  };
  
  const getIconHoverBg = () => {
    if (isDark) {
      return "hover:bg-gray-700";
    }
    
    if (isScrolled || isAuthPage) {
      return "hover:bg-gray-100";
    }
    
    return "hover:bg-white/10";
  };
  
  const getSearchBg = () => {
    if (isDark) {
      return "bg-gray-800 border-gray-700";
    }
    
    if (isExpanded) {
      return " border-gray-200";
    }
    
    if (isScrolled || isAuthPage) {
      return "bg-white border-gray-200";
    }
    
    return "bg-white/10 border-white/20";
  };
  
  const getSearchTextColor = () => {
    if (isDark) {
      return "text-white placeholder-gray-400";
    }
    
    if (isScrolled || isAuthPage) {
      return "text-gray-800 placeholder-gray-400";
    }
    
    return "text-white placeholder-white/50";
  };
  
  // Handle click outside to close expanded search on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Navigate through suggestions with arrow keys
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        // Navigate to the selected suggestion
        const selectedTour = suggestions[selectedIndex];
        router.push(`/tours/${selectedTour.id || selectedTour.slug}`);
        setQuery("");
        setIsExpanded(false);
      } else if (query.trim()) {
        // Perform a search with the current query
        router.push(`/tours?search=${encodeURIComponent(query.trim())}`);
        setQuery("");
        setIsExpanded(false);
      }
    } else if (e.key === "Escape") {
      // Close the search suggestions
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  // Toggle expanded state for mobile
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  
  // Clear search input
  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tours?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsExpanded(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${isExpanded ? 'w-full md:w-80' : 'w-auto'} transition-all duration-300`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center ${getIconColor()}`}>
          {/* Mobile search icon (only shown when collapsed) */}
          {!isExpanded && (
            <button
              type="button"
              onClick={toggleExpanded}
              className={`p-2 rounded-full ${getIconHoverBg()} md:hidden focus:outline-none`}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          )}
          
          {/* Search input */}
          <div className={`relative ${isExpanded ? 'flex' : 'hidden md:flex'} items-center`}>
            <div className={`relative flex items-center rounded-full ${getSearchBg()} overflow-hidden`}>
              <div className="pl-3">
                <Search size={16} className={getIconColor()} />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsExpanded(true)}
                placeholder="Search tours..."
                className={`w-full py-2 px-2 focus:outline-none text-sm bg-transparent ${getSearchTextColor()}`}
                aria-label="Search tours"
              />
              
              {/* Clear button appears when text is entered */}
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 focus:outline-none"
                  aria-label="Clear search"
                >
                  <X size={16} className={getIconColor()} />
                </button>
              )}
            </div>
            
            {/* Close button for mobile expanded view */}
            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className={`ml-2 p-2 rounded-full md:hidden focus:outline-none ${getIconHoverBg()}`}
                aria-label="Close search"
              >
                <X size={20} className={getIconColor()} />
              </button>
            )}
          </div>
        </div>
        
        {/* Search suggestions dropdown */}
        {isExpanded && query.trim() && (
          <SearchResults 
            suggestions={suggestions}
            loading={loading}
            error={error}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSelect={(suggestion) => {
              router.push(`/tours/${suggestion.id || suggestion.slug}`);
              setQuery("");
              setIsExpanded(false);
            }}
            isAuthPage={isAuthPage}
            isDark={isDark}
          />
        )}
      </form>
    </div>
  );
};

export default SearchBar;
