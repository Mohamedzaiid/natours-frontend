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
import { Loader2, Send, X, User, MessageCircle, Image, Paperclip, Clock, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { cn } from "@/lib/utils/utils";
import ChatSearchResults from "./ui/ChatSearchResults";

// Typing animation component
const TypingAnimation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Speed of typing animation
      
      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex]);
  
  return displayedText;
};

const ChatBubble = ({ message, isUser, isTyping, searchResults, loadingResults }) => {
  const { isDark } = useTheme();
  const hasResults = message.searchResults || searchResults;
  
  return (
    <div className={cn(
      "flex w-full mb-4 animate-fadeIn",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-start gap-2",
        isUser ? "flex-row-reverse max-w-[80%]" : "max-w-[85%]"
      )}>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-white mt-0.5 shadow-md flex-shrink-0",
          isUser ? "bg-emerald-600" : "bg-emerald-700"
        )}>
          {isUser ? (
            <User className="h-4 w-10" />
          ) : (
            <MessageCircle className="h-4 w-10" />
          )}
        </div>
        <div className={cn(
          "rounded-lg px-4 py-2 text-sm shadow-sm",
          isUser 
            ? "bg-emerald-600 text-white rounded-tr-none" 
            : `${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-tl-none`,
          hasResults ? "w-full" : ""
        )}>
          {isTyping ? (
            <TypingAnimation text={message.content} />
          ) : (
            <>
              <div className="prose prose-sm dark:prose-invert">
                {message.content}
              </div>
              
              {/* Show search results if available */}
              {hasResults && (
                <div className={cn(
                  "mt-3 pt-3 border-t",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}>
                  <ChatSearchResults 
                    results={message.searchResults || searchResults} 
                    loading={loadingResults}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Typing indicator with bouncing dots
const TypingIndicator = () => (
  <div className="flex w-full mb-4 justify-start">
    <div className="flex items-start gap-2">
      <div className="h-8 w-8 rounded-full flex items-center justify-center text-white mt-0.5 bg-emerald-700 shadow-md">
        <MessageCircle className="h-4 w-4" />
      </div>
      <div className="rounded-lg px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-tl-none shadow-sm">
        <div className="flex space-x-1 h-5 items-center">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export function ChatModal({ 
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
  const [recommendedTours, setRecommendedTours] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // For simulated typing animation
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  
  // Keep streaming state variables (commented out but preserved)
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  // Initialize chat when opened
  useEffect(() => {
    if (open && messages.length === 0) {
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
          messageContent += `. Can you help me plan my trip?`;
        }
        
        initialMessage = {
          role: 'user',
          content: messageContent,
          id: Date.now().toString()
        };
      } else {
        // Standard initial message from CTA section
        initialMessage = {
          role: 'user',
          content: `Hi, I'm ${userName} (${userEmail}). I want a trip to ${destination}${travelInterests ? `, and I'm interested in ${travelInterests}` : ''}. Can you help me plan?`,
          id: Date.now().toString()
        };
      }
      
      setMessages([initialMessage]);
      sendMessage(initialMessage);
    }
  }, [open, userName, userEmail, destination, travelInterests, messages.length, isFromSearch, searchCriteria, searchResults]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamedContent]);

  const sendMessage = async (message) => {
    setIsLoading(true);
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
              // Save the recommended tours 
              setRecommendedTours(searchData.results);
              setAiSearchResults(searchData.results);
            }
          } catch (error) {
            console.error('Error searching for tours:', error);
          }
        }
      }

      // Use regular chat API instead of streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, message] }),
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
          searchResults: aiSearchResults
        };
        
        aiMessage = assistantMessage;
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        setIsTyping(true);
        setTypingMessageId(assistantMessage.id);
        
        // Disable typing animation after a reasonable time (based on message length)
        const typingDuration = Math.min(assistantMessage.content.length * 15, 5000);
        setTimeout(() => {
          setIsTyping(false);
          setTypingMessageId(null);
        }, typingDuration);
      }
      
      /* Streaming API code (preserved but commented out)
      // Use streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, message] }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle the stream
      setIsStreaming(true);
      setStreamedContent('');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const text = decoder.decode(value);
          const lines = text.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                
                if (data.content) {
                  setStreamedContent(prev => prev + data.content);
                }
                
                if (data.done) {
                  // Streaming complete, add the full message
                  setIsStreaming(false);
                  setMessages(prevMessages => [
                    ...prevMessages,
                    { role: 'assistant', content: streamedContent }
                  ]);
                  setStreamedContent('');
                }
              } catch (e) {
                console.error('Error parsing SSE data', e);
              }
            }
          }
        }
      }
      */
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: `Sorry, I encountered an error while processing your request: ${error.message}. This could be due to a connection issue or the OpenAI API key not being properly configured. Please check with the administrator.`,
          id: Date.now().toString()
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsLoadingResults(false);
      setIsStreaming(false); // Keep this even with normal API for now

      // Clear search results after they've been attached to a message
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[650px] p-0 gap-0 h-[85vh] max-h-[750px] flex flex-col rounded-xl overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      )}>
        <DialogHeader className="p-4 border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-95 bg-inherit">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
              <MessageCircle className="h-5 w-5" />
            </span>
            {isFromSearch ? 'Natours AI Tour Planner' : 'Natours Travel Concierge'}
            <div className="ml-auto flex items-center gap-1 text-emerald-600 text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Clock className="h-3 w-3" />
              <span>24/7 Available</span>
            </div>
          </DialogTitle>
          {isFromSearch && searchCriteria && (
            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">Your search criteria:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {searchCriteria.destination && (
                  <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs flex items-center">
                    <MapPin size={12} className="mr-1 text-emerald-600" />
                    {searchCriteria.destination}
                  </span>
                )}
                {searchCriteria.dateRange && (
                  <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs flex items-center">
                    <Calendar size={12} className="mr-1 text-emerald-600" />
                    {searchCriteria.dateRange}
                  </span>
                )}
                {searchCriteria.people && (
                  <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs flex items-center">
                    <Users size={12} className="mr-1 text-emerald-600" />
                    {searchCriteria.people} {parseInt(searchCriteria.people, 10) === 1 ? 'person' : 'people'}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 p-4 pb-20 overflow-y-auto"
        >
          {messages.map((message) => (
            <ChatBubble 
              key={message.id} 
              message={message} 
              isUser={message.role === 'user'}
              isTyping={isTyping && typingMessageId === message.id && message.role === 'assistant'}
              searchResults={message.searchResults}
              loadingResults={message.id === messages[messages.length - 1]?.id && isLoadingResults}
            />
          ))}
          
          {/* Commenting out streaming content bubble */}
          {isStreaming && streamedContent && (
            <ChatBubble 
              message={{ content: streamedContent }} 
              isUser={false} 
            />
          )}

          {isLoading && !isStreaming && (
            <TypingIndicator />
          )}
          
          {/* Display initial recommended tours from search if available */}
          {isFromSearch && searchResults && searchResults.length > 0 && messages.length === 1 && (
            <div className="mb-4 animate-fadeIn">
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white mt-0.5 shadow-md bg-amber-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className={cn(
                    "rounded-lg px-4 py-2 text-sm shadow-sm w-full",
                    isDark ? 'bg-amber-900/20 text-amber-100' : 'bg-amber-50 text-amber-800'
                  )}>
                    <p className="font-medium">Recommended Tours</p>
                    <p className="text-xs mb-3">I found these tours that might interest you:</p>
                    <ChatSearchResults 
                      results={searchResults} 
                      loading={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className={cn(
          "p-4 border-t flex gap-2 items-center absolute bottom-0 left-0 right-0 w-full z-10 backdrop-blur-sm",
          isDark ? "border-gray-700 bg-gray-900/95" : "border-gray-200 bg-white/95"
        )}>
          {/* <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
            title="Attach files"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
            title="Add image"
          >
            <Image className="h-5 w-5" />
          </Button> */}
          
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className={cn(
              "flex-1 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-full py-6",
              isDark ? "bg-gray-800" : "bg-gray-100"
            )}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || input.trim() === ''}
            size="icon"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-10 w-10 shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatModal;