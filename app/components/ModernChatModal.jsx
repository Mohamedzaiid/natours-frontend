"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Loader2, Send, X, User, MessageCircle, Image, 
  Paperclip, Clock, Sparkles, MapPin, Calendar, 
  Users, ChevronDown, MoreHorizontal, Smile,
  ThumbsUp, ThumbsDown, RefreshCw, ExternalLink
} from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { cn } from "@/lib/utils/utils";
import { motion, AnimatePresence } from '@/lib/animations/motion';
import ModernChatResults from "./ui/ModernChatResults";
import Link from 'next/link';

// Modern typing animation component
const TypingAnimation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10); // Faster typing animation
      
      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex]);
  
  return displayedText;
};

// Enhanced chat bubble with better formatting and UI
const ModernChatBubble = ({ message, isUser, isTyping, searchResults, loadingResults, onFeedback, persistentTours }) => {
  const { isDark } = useTheme();
  const hasResults = message.searchResults || searchResults;
  const hasPersistentToursRef = message.hasPersistentTours;
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  
  return (
    <motion.div 
      className={cn(
        "flex w-full mb-5",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse max-w-[85%]" : "max-w-[85%]"
      )}>
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0",
          isUser ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-emerald-600 to-teal-700"
        )}>
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <div className={cn(
            "rounded-2xl px-5 py-3 shadow-sm",
            isUser 
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-none" 
              : `${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-tl-none`,
            hasResults ? "w-full max-w-full" : ""
          )}>
            {isTyping ? (
              <div className="min-h-[24px]">
                <TypingAnimation text={message.content} />
              </div>
            ) : (
              <>
                <div className="prose prose-sm dark:prose-invert">
                  {message.content}
                </div>
                
                {/* Show search results if available with modernized UI */}
                {hasResults && (
                  <div className={cn(
                    "mt-4 pt-3 border-t",
                    isDark ? "border-gray-700" : "border-gray-200"
                  )}>
                    <ModernChatResults 
                    results={message.searchResults || searchResults} 
                    loading={loadingResults}
                    isInPanel={false}
                    />
                  </div>
                )}
                
                {/* We no longer show tours in every message - only when they're explicitly attached */}
              </>
            )}
          </div>
          
          {/* Message timestamp and feedback buttons */}
          {!isUser && !isTyping && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-1">
              <span className="mr-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              {!feedbackGiven ? (
                <div 
                  className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 cursor-pointer"
                  onMouseEnter={() => setShowFeedback(true)}
                  onMouseLeave={() => setShowFeedback(false)}
                >
                  <AnimatePresence>
                    {showFeedback ? (
                      <>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full"
                          onClick={() => {
                            onFeedback && onFeedback('helpful');
                            setFeedbackGiven('helpful');
                          }}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                          onClick={() => {
                            onFeedback && onFeedback('unhelpful');
                            setFeedbackGiven('unhelpful');
                          }}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </motion.button>
                      </>
                    ) : (
                      <span>Feedback</span>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-600 dark:text-emerald-400 flex items-center"
                >
                  {feedbackGiven === 'helpful' ? (
                    <>
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      <span>Thanks for your feedback</span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                      <span>Thanks for your feedback</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced typing indicator with more attractive styling
const ModernTypingIndicator = () => (
  <motion.div 
    className="flex w-full mb-5 justify-start"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-br from-emerald-600 to-teal-700">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="rounded-2xl px-5 py-3 bg-gray-100 dark:bg-gray-800 rounded-tl-none shadow-sm">
        <div className="flex space-x-2 h-6 items-center">
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Quick suggestion buttons component
const QuickSuggestions = ({ onSelect }) => {
  const { isDark } = useTheme();
  const suggestions = [
    "Find beach tours",
    "Family-friendly options",
    "Adventure activities",
    "Budget-friendly packages",
    "Best time to visit"
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm flex items-center transition-colors",
            isDark
              ? "bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300"
              : "bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 shadow-sm hover:shadow"
          )}
          onClick={() => onSelect(suggestion)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{suggestion}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Initial welcome message component
const WelcomeMessage = ({ destination }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div 
      className="mb-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={cn(
          "p-6 rounded-xl shadow-md bg-gradient-to-br",
          isDark 
            ? "from-emerald-900/30 to-teal-900/20 border border-emerald-800/50" 
            : "from-emerald-50 to-teal-50 border border-emerald-100"
        )}
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
          Welcome to Natours AI Travel Assistant
        </h3>
        
        <p className="text-emerald-600 dark:text-emerald-400 mb-4">
          {destination 
            ? `I'm here to help you plan your perfect trip to ${destination}!` 
            : "I'm here to help you find your perfect adventure!"}
        </p>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Ask me anything about tours, destinations, or travel tips.
        </div>
      </motion.div>
    </motion.div>
  );
};

export function ModernChatModal({ 
  userName, 
  userEmail, 
  destination,
  travelInterests,
  open,
  onOpenChange,
  searchCriteria,
  searchResults,
  isFromSearch = false
}) {
  // State for AI search suggestions
  const [aiSearchResults, setAiSearchResults] = useState(searchResults || null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [persistentTours, setPersistentTours] = useState(searchResults || []);
  const [showTourPanel, setShowTourPanel] = useState(searchResults && searchResults.length > 0);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // For simulated typing animation
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  // UI state
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  // Removed tourPanelCollapsed state as we're no longer using a collapsible panel
  
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isDark } = useTheme();

  // Initialize chat when opened and handle tour results
  useEffect(() => {
    if (open) {
      // If search results are provided, initialize the persistent tours
      if (searchResults && searchResults.length > 0) {
        setPersistentTours(searchResults);
        setShowTourPanel(true);
      }
      
      // Initialize chat if it's empty
      if (messages.length === 0) {
        let initialMessage;
        
        if (isFromSearch) {
          // Format initial message for search queries
          const { destination, dateRange, people } = searchCriteria || {};
          
          let messageContent = `Hi, I'm looking for travel options`;
          
          if (destination) {
            messageContent += ` to ${destination}`;
          }
          
          if (dateRange) {
            messageContent += ` during ${dateRange}`;
          }
          
          if (people) {
            messageContent += ` for ${people} ${people === 1 ? 'person' : 'people'}`;
          }
          
          if (!searchResults || searchResults.length === 0) {
            messageContent += `. I couldn't find any tours matching my criteria on your website. Can you help me create a custom travel plan?`;
          } else {
            messageContent += `. I found ${searchResults.length} tours that might interest me. Can you help me understand which one would be best for my trip?`;
          }
          
          initialMessage = {
            role: 'user',
            content: messageContent,
            id: Date.now().toString()
          };
          
          // Don't show the welcome message for search queries
          setIsFirstInteraction(false);
        } else {
          // Standard initial message from CTA section
          initialMessage = {
            role: 'user',
            content: `Hi, I'm ${userName || 'a traveler'} ${userEmail ? `(${userEmail})` : ''}. I want a trip to ${destination || 'somewhere amazing'}${travelInterests ? `, and I'm interested in ${travelInterests}` : ''}. Can you help me plan?`,
            id: Date.now().toString()
          };
        }
        
        setMessages([initialMessage]);
        sendMessage(initialMessage);
      }
    }
  }, [open, userName, userEmail, destination, travelInterests, messages.length, isFromSearch, searchCriteria, searchResults]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [open]);

  const sendMessage = async (message) => {
    setIsLoading(true);
    setIsFirstInteraction(false);
    setShowSuggestions(false);
    let aiMessage = null;
    
    try {
      // Extract search keywords from message
      const extractSearchKeywords = (content) => {
        const locationMatches = content.match(/\b(?:to|in|at)\s+([A-Za-z\s,]+?)(?:\.|,|\s+for|\s+during|$)/i);
        const destination = locationMatches ? locationMatches[1].trim() : null;
        
        const dateMatches = content.match(/\b(?:during|on|at|for|in)\s+([A-Za-z\s,]+?\b(?:2023|2024|2025|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|spring|summer|fall|winter|weekend|weekday|holiday|christmas|thanksgiving)[A-Za-z\s,]*?)(?:\.|,|\s+for|$)/i);
        const dateRange = dateMatches ? dateMatches[1].trim() : null;
        
        return { destination, dateRange };
      };
      
      // Check if message might trigger a search
      if (message.content.match(/\b(?:find|search|looking for|tour|vacation|trip|visit|travel|to|in)\b/i)) {
        const { destination, dateRange } = extractSearchKeywords(message.content);
        
        if (destination) {
          // Show loading state for search results
          setIsLoadingResults(true);
          
          // Search for matching tours
          try {
            const searchResponse = await fetch('/api/tours/search', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                destination: destination,
                dateRange: dateRange || '',
                // Try to extract people count if available
                people: message.content.match(/\b(\d+)\s+(?:people|person|traveler|travelers|guest|guests|group|groups)\b/i)?.[1] || ''
              }),
            });
            
            const searchData = await searchResponse.json();
            if (searchData.results && searchData.results.length > 0) {
              // Save the recommended tours to both temporary and persistent states
              setPersistentTours(searchData.results);
              setAiSearchResults(searchData.results);
              setShowTourPanel(true);
              
              // Add a system message to let the user know tours were found
              setTimeout(() => {
                const systemTourMessage = {
                  role: 'assistant',
                  content: `I found ${searchData.results.length} tours that match your criteria. You can ask me specific questions about any of these tours!`,
                  id: Date.now().toString(),
                  searchResults: searchData.results,
                  hasPersistentTours: true
                };
                
                setMessages(prevMessages => [...prevMessages, systemTourMessage]);
              }, 500);
            }
          } catch (error) {
            console.error('Error searching for tours:', error);
          }
        }
      }

      // Use regular chat API instead of streaming
      // Include tour information in the messages for context
      const messagesToSend = [...messages, message];
      
      // If we have tour results, add them to the context but in a extremely minimal format
      if(persistentTours && persistentTours.length > 0) {
        // Limit to maximum 5 tours to avoid token limits
        const toursToInclude = persistentTours.slice(0, 5);
        
        // Create an ultra-condensed tour summary
        const condensedTours = toursToInclude.map(tour => {
          // Absolute bare minimum information in terse format
          return `${tour.name}: ${tour.duration}d/${tour.price}/${tour.difficulty || 'moderate'}`;
        }).join('. ');
        
        // Create a minimal system message
        const tourContext = {
          role: 'system',
          content: `Found ${persistentTours.length} tours. Top matches: ${condensedTours}`
        };
        messagesToSend.push(tourContext);
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.message) {
        // Add the message with typing animation
        const assistantMessage = {
          role: 'assistant',
          content: data.message.content,
          id: Date.now().toString(),
          // Add search results to the message if available
          searchResults: aiSearchResults,
          // We still track if there are persistent tours for context
          hasPersistentTours: persistentTours && persistentTours.length > 0
        };
        
        aiMessage = assistantMessage;
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        setIsTyping(true);
        setTypingMessageId(assistantMessage.id);
        
        // Disable typing animation after a reasonable time (based on message length)
        const typingDuration = Math.min(assistantMessage.content.length * 10, 3000);
        setTimeout(() => {
          setIsTyping(false);
          setTypingMessageId(null);
          
          // Show suggestions again after AI response
          setTimeout(() => {
            setShowSuggestions(true);
          }, 500);
        }, typingDuration);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: `Sorry, I encountered an error while processing your request. Please try again in a moment.`,
          id: Date.now().toString()
        }
      ]);
      
      // Show suggestions again after error
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
    } finally {
      setIsLoading(false);
      setIsLoadingResults(false);

      // We only clear temporary search results, but keep the persistent ones
      setAiSearchResults(null);
    }

    return aiMessage;
  };

  const handleSendMessage = () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage = { 
      role: 'user', 
      content: input,
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    sendMessage(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    
    // Slightly delay sending to give visual feedback
    setTimeout(() => {
      const userMessage = { 
        role: 'user', 
        content: suggestion,
        id: Date.now().toString()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      sendMessage(userMessage);
    }, 300);
  };
  
  const handleFeedback = (messageId, feedbackType) => {
    // Could implement feedback collection API here
    console.log(`Feedback received for message ${messageId}: ${feedbackType}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[700px] p-0 gap-0 h-[85vh] max-h-[750px] flex flex-col rounded-xl overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-0",
        isDark ? "bg-gray-900 text-white shadow-2xl shadow-emerald-900/20" : "bg-white text-gray-900 shadow-2xl shadow-emerald-600/10"
      )}>
        {/* Header with gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient"></div>
        
        <DialogHeader className="p-4 border-b sticky top-0 z-10 backdrop-blur-md bg-opacity-95 bg-inherit">
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">
                {isFromSearch ? 'Natours AI Tour Planner' : 'Natours Travel Concierge'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Powered by advanced AI</div>
            </div>
            
            <div className="ml-auto flex items-center">
              <Link href="/tours" className="text-xs flex items-center text-emerald-600 dark:text-emerald-400 hover:underline mr-3">
                <ExternalLink className="h-3 w-3 mr-1" />
                View All Tours
              </Link>
              <div className="flex items-center gap-1 text-emerald-600 text-xs px-2 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30">
                <Clock className="h-3 w-3" />
                <span>24/7 Available</span>
              </div>
            </div>
          </DialogTitle>
          
          {/* Search criteria display for search-initiated chats */}
          {isFromSearch && searchCriteria && (
            <motion.div 
              className={cn(
                "mt-3 p-3 rounded-lg text-sm",
                isDark 
                  ? "bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-800/30" 
                  : "light-mode-search-header"
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Your search criteria:</p>
              <div className="flex flex-wrap gap-2">
                {searchCriteria.destination && (
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs flex items-center shadow-sm", 
                    isDark 
                      ? "bg-gray-800/80 text-emerald-300" 
                      : "bg-white shadow-md text-emerald-700"
                  )}>
                    <MapPin size={12} className="mr-1.5 text-emerald-600" />
                    <span className="font-medium">{searchCriteria.destination}</span>
                  </span>
                )}
                {searchCriteria.dateRange && (
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs flex items-center shadow-sm", 
                    isDark 
                      ? "bg-gray-800/80 text-emerald-300" 
                      : "bg-white shadow-md text-emerald-700"
                  )}>
                    <Calendar size={12} className="mr-1.5 text-emerald-600" />
                    <span className="font-medium">{searchCriteria.dateRange}</span>
                  </span>
                )}
                {searchCriteria.people && (
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs flex items-center shadow-sm", 
                    isDark 
                      ? "bg-gray-800/80 text-emerald-300" 
                      : "bg-white shadow-md text-emerald-700"
                  )}>
                    <Users size={12} className="mr-1.5 text-emerald-600" />
                    <span className="font-medium">{searchCriteria.people} {parseInt(searchCriteria.people, 10) === 1 ? 'person' : 'people'}</span>
                  </span>
                )}
                
                <button 
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs flex items-center transition-colors ml-auto",
                    isDark
                      ? "bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400"
                      : "bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-600 shadow-sm hover:shadow"
                  )}
                  onClick={() => {
                    // Could implement a refine search functionality here
                    handleSuggestionClick("I'd like to refine my search criteria");
                  }}
                >
                  <RefreshCw size={12} className="mr-1.5" />
                  Refine Search
                </button>
              </div>
            </motion.div>
          )}
        </DialogHeader>
        
        {/* We've removed the persistent panel at the top as requested */}

        {/* Main chat area */}
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 p-5 pb-24 overflow-y-auto"
        >
          {/* Welcome message for first-time chat */}
          {isFirstInteraction && (
            <WelcomeMessage destination={destination} />
          )}
          
          {/* Show the tour recommendations in the chat if coming from search */}
          {isFromSearch && searchResults && searchResults.length > 0 && messages.length === 1 && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[90%]">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-br from-amber-500 to-orange-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className={cn(
                      "rounded-2xl px-5 py-4 shadow-md w-full",
                      isDark ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-800/30' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/80'
                    )}>
                      <h3 className="font-bold text-amber-700 dark:text-amber-300 mb-1">Tour Recommendations</h3>
                      <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                        I found these tours that match your search criteria:
                      </p>
                      <ModernChatResults 
                        results={searchResults} 
                        loading={false}
                        isInPanel={false}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-1 mt-1">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Chat messages */}
          {messages.map((message) => (
            <ModernChatBubble 
              key={message.id} 
              message={message} 
              isUser={message.role === 'user'}
              isTyping={isTyping && typingMessageId === message.id && message.role === 'assistant'}
              searchResults={message.searchResults}
              loadingResults={message.id === messages[messages.length - 1]?.id && isLoadingResults}
              onFeedback={(type) => handleFeedback(message.id, type)}
              persistentTours={persistentTours}
            />
          ))}
          
          {/* Typing indicator */}
          {isLoading && !isTyping && (
            <ModernTypingIndicator />
          )}
          
          {/* Quick suggestions */}
          {showSuggestions && messages.length > 0 && !isLoading && !isTyping && (
            <motion.div
              className={cn(
                "mb-6 mt-4 p-3 rounded-lg",
                isDark 
                  ? "bg-gray-800/40" 
                  : "bg-gray-50 border border-gray-100 shadow-sm"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
              <QuickSuggestions onSelect={handleSuggestionClick} />
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* Chat input area with enhanced styling */}
        <div className={cn(
          "p-4 border-t flex gap-3 items-center absolute bottom-0 left-0 right-0 w-full z-10 backdrop-blur-md",
          isDark ? "border-gray-800 bg-gray-900/95" : "border-gray-100 bg-white/95"
        )}>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading || isTyping}
              className={cn(
                "w-full border focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 rounded-xl py-6 pl-4 pr-10 shadow-sm",
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                isLoading || isTyping ? "opacity-50" : ""
              )}
            />
            
            {/* Emoji button positioned relative to input */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 hover:bg-transparent"
              disabled={isLoading || isTyping}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || isTyping || input.trim() === ''}
            className={cn(
              "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl h-12 px-5 shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2",
              isLoading || isTyping || input.trim() === '' ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModernChatModal;