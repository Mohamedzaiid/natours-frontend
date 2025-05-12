"use client";

import { useState } from "react";
import { Calendar, Users, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/app/providers/theme/ThemeProvider";
import BookTourButton from "@/app/components/tours/BookTourButton";

export function TourBooking({ tour }) {
  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const { theme, isDark } = useTheme();

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate total price
  const totalPrice = tour.price * participants;
  const hasDiscount = tour.priceDiscount && tour.priceDiscount > 0;
  const discountAmount = hasDiscount
    ? (tour.price - tour.priceDiscount) * participants
    : 0;
  const finalPrice = totalPrice - discountAmount;

  // Handle participant change
  const handleParticipantChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= tour.maxGroupSize) {
      setParticipants(value);
    }
  };



  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${isDark ? 'dark-tour-form' : ''}`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-emerald-50 border-emerald-100'} p-5 border-b`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Book this tour</h3>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
          Secure your spot with a quick booking
        </p>
      </div>

      <div className="p-5">
        {/* Available Start Dates */}
        <div className="mb-5">
          <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-700'} mb-2`}>
            Select a start date
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className={`w-full flex items-center justify-between border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-gray-700'} rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-emerald-600" />
                <span>
                  {selectedDate ? formatDate(selectedDate) : "Select a date"}
                </span>
              </div>
              <ChevronDown size={18} className="text-gray-400" />
            </button>

            {isDateDropdownOpen && (
              <div className={`absolute z-10 mt-1 w-full  ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200 '} border rounded-lg shadow-lg`}>
                <div className="max-h-60 overflow-auto py-1">
                  {tour.startDates && tour.startDates.length > 0 ? (
                    tour.startDates.map((date, index) => (
                      <button
                        key={index}
                        className={`w-full text-left  px-4 py-2.5 flex items-center justify-between ${
                          selectedDate === date
                            ? "bg-emerald-50 text-emerald-700"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedDate(date);
                          setIsDateDropdownOpen(false);
                        }}
                      >
                        <span className={`font-medium  ${isDark ? ' text-gray-300 ': ' text-gray-500 '}`}>{formatDate(date)}</span>
                        {selectedDate === date && (
                          <Check size={18} className="text-emerald-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No available dates
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Number of Participants */}
        <div className="mb-5">
          <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-700'} mb-2`}>
            Number of participants
          </label>
          <div className={`flex items-center border rounded-lg ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}>
            <button
              className="px-4 py-2.5 text-emerald-600 hover:bg-gray-50 focus:outline-none"
              onClick={() =>
                participants > 1 && setParticipants(participants - 1)
              }
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={tour.maxGroupSize}
              value={participants}
              onChange={handleParticipantChange}
              className={`w-full text-center border-none focus:ring-0 focus:outline-none ${isDark ? 'bg-gray-700 text-white' : ''}`}
            />
            <button
              className="px-4 py-2.5 text-emerald-600 hover:bg-gray-50 focus:outline-none"
              onClick={() =>
                participants < tour.maxGroupSize &&
                setParticipants(participants + 1)
              }
            >
              +
            </button>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 flex items-center gap-1`}>
            <Users size={14} />
            <span>Max {tour.maxGroupSize} people per booking</span>
          </p>
        </div>

        {/* Price Calculation */}
        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg mb-5`}>
          <div className="flex justify-between mb-2">
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Price per person</span>
            <span className="font-medium">${tour.price}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-600">{participants} × participants</span>
            <span className="font-medium">${totalPrice}</span>
          </div>

          {hasDiscount && (
            <div className="flex justify-between mb-2 text-emerald-600">
              <span>Discount</span>
              <span>-${discountAmount}</span>
            </div>
          )}

          <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'} my-2 pt-2`}></div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalPrice}</span>
          </div>
        </div>

        {/* Booking Button */}
        <BookTourButton 
          tour={tour} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg" 
          hasSelectedDate={!!selectedDate}
          participants={participants}
        />

        <p className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
          You'll be redirected to Stripe to complete payment
        </p>
      </div>
    </div>
  );
}

export default TourBooking;
