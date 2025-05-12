"use client";

import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useAuthPrompt } from "@/app/providers/AuthPromptProvider";
import { createBookingCheckout } from "@/lib/api/bookings";

const BookTourButton = ({ tour, className = "", variant = "primary", icon = true, hasSelectedDate = true, participants = 1 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { toggleAuthPrompt } = useAuthPrompt();

  // Style variants
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg",
    secondary: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20"
  };

  const handleBookNow = async () => {
    // Clear any previous errors
    setError(null);

    // Check if user is authenticated
    if (!isAuthenticated) {
      toggleAuthPrompt(true);
      return;
    }

    // Check if date is required but not selected
    if (!hasSelectedDate) {
      setError("Please select a tour date first");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a checkout session with participants count
      const response = await createBookingCheckout(tour.id, participants);
      
      // Redirect to Stripe checkout
      if (response && response.status === 'success' && response.session && response.session.url) {
        window.location.href = response.session.url;
      } else {
        throw new Error('Could not create checkout session');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'An error occurred while processing your booking');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={`font-medium py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 ${variants[variant]} ${className} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        onClick={handleBookNow}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Book this Tour</span>
            {icon && <ChevronRight size={18} />}
          </>
        )}
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </>
  );
};

export default BookTourButton;
