"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/app/providers/DataProvider";
import { fetchTourById } from "@/lib/api/enhanced";
import { useTheme } from "@/app/providers/theme/ThemeProvider";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Heart,
  Share2,
  ChevronRight,
  Compass,
  Flag,
  Camera,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import WishlistButton from "@/app/components/ui/wishlist/WishlistButton";
import BookTourButton from "@/app/components/tours/BookTourButton";
import { TourGallery } from "@/app/components/tours/TourGallery";
import { TourGuides } from "@/app/components/tours/TourGuides";
import { TourReviews } from "@/app/components/tours/TourReviews";
import { TourMap } from "@/app/components/tours/TourMap";
import { TourBooking } from "@/app/components/tours/TourBooking";
import { SimilarTours } from "@/app/components/tours/SimilarTours";

export default function TourDetailPage({ params }) {
  // Properly unwrap params object using React.use
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const { theme, isDark } = useTheme();
  
  // Use the data context for caching
  const { 
    fetchData, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();
  
  const cacheKey = `tours/${unwrappedParams.id}`;
  const tour = cache[cacheKey];
  const loading = cacheLoading[cacheKey];
  const error = cacheErrors[cacheKey];

  // Fetch tour on component mount
  useEffect(() => {
    fetchTour();
    
    // Make the header transparent on page load
    const headerElem = document.querySelector('header');
    if (headerElem) {
      headerElem.classList.remove('bg-white', 'shadow-md');
      headerElem.classList.add('bg-transparent');
    }

    // Add scroll event listener to handle header style changes
    const handleScroll = () => {
      const headerElem = document.querySelector('header');
      if (headerElem) {
        if (window.scrollY > 100) {
          headerElem.classList.remove('bg-transparent');
          headerElem.classList.add('bg-white', 'shadow-md');
          if (isDark) {
            headerElem.classList.add('dark-header');
          }
        } else {
          headerElem.classList.add('bg-transparent');
          headerElem.classList.remove('bg-white', 'shadow-md', 'dark-header');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset header when component unmounts
      const headerElem = document.querySelector('header');
      if (headerElem) {
        headerElem.classList.remove('bg-transparent');
        headerElem.classList.add('bg-white', 'shadow-md');
      }
    };
  }, [unwrappedParams.id, isDark]);
  
  // Function to fetch tour data with caching
  const fetchTour = async (force = false) => {
    try {
      await fetchData(cacheKey, fetchTourById(unwrappedParams.id), force);
    } catch (err) {
      console.error('Error fetching tour:', err);
    }
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    fetchTour(true); // Force refresh
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg mb-6 max-w-lg mx-auto">
          <AlertCircle size={24} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Tour</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <p className="mb-6">
          The tour you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/tours" className="btn-primary">
          Browse All Tours
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Updated to match reference */}
      <div className="relative h-[90vh] w-full bg-slate-500">
        <Image
          src={
            tour.imageCover
              ? tour.imageCover
              : "/images/tour-placeholder.jpg"
          }
          alt={tour.name}
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized={tour.imageCover?.startsWith('http')}
          className="mix-blend-overlay opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40 flex items-center">
          <div className="container mx-auto px-4 md:px-8 py-16 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-6 max-w-6xl mx-auto">
              <div className="flex-1">
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="inline-block bg-emerald-500/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
                    {tour.difficulty.charAt(0).toUpperCase() +
                      tour.difficulty.slice(1)}{" "}
                    Tour
                  </span>
                  <span className="inline-block bg-blue-500/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
                    {tour.duration} Days
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-sm">
                  {tour.name}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                  {tour.summary || "Experience an unforgettable journey through breathtaking landscapes and immerse yourself in rich cultural experiences."}
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        fill={
                          i < Math.round(tour.ratingsAverage)
                            ? "#FBBF24"
                            : "none"
                        }
                        size={20}
                        className="text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-gray-200">
                    {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <MapPin size={22} className="text-emerald-400" />
                    </div>
                    <span className="font-medium">
                      {tour.startLocation?.description || "Various locations"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Calendar size={22} className="text-blue-400" />
                    </div>
                    <span className="font-medium">{tour.duration} days</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Users size={22} className="text-purple-400" />
                    </div>
                    <span className="font-medium">Max {tour.maxGroupSize} people</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Clock size={22} className="text-amber-400" />
                    </div>
                    <span className="font-medium">
                      {tour.startDates && tour.startDates.length > 0
                        ? new Date(tour.startDates[0]).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )
                        : "Flexible dates"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-10">
                  <BookTourButton 
                    tour={tour} 
                    variant="primary" 
                    icon={true}
                    hasSelectedDate={true}
                  />
                  <button 
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/20"
                    onClick={() => setActiveTab("itinerary")}
                  >
                    <span>Explore Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-30 right-6 flex gap-3">
          
          <WishlistButton 
            tour={tour} 
            size="lg" 
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all border border-white/20 text-white" 
          />
          <button className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all border border-white/20">
            <Share2 size={20} className="text-white" />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all border border-white/20"
            title="Refresh tour data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tour Navigation */}
      <div className={`sticky top-0 z-10 bg-white shadow-md ${isDark ? 'dark-tour-navigation' : ''}`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto gap-1 scrollbar-hide">
            {[
              {id: "overview", label: "Overview", icon: <Compass size={18} />},
              {id: "itinerary", label: "Itinerary", icon: <Flag size={18} />},
              {id: "location", label: "Location", icon: <MapPin size={18} />},
              {id: "reviews", label: "Reviews", icon: <Star size={18} />},
              {id: "guides", label: "Guides", icon: <Users size={18} />},
              {id: "gallery", label: "Gallery", icon: <Camera size={18} />},
            ].map(
              (tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${isDark ? 'text-white' : ''} ${
                    activeTab === tab.id
                      ? `text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 ${isDark ? 'dark-active-tab' : ''}`
                      : `text-gray-600 hover:text-emerald-600 hover:bg-gray-50 ${isDark ? 'dark-inactive-tab' : ''}`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Tour Content Section */}
      <div className={`container mx-auto px-4 md:px-8 py-16 ${isDark ? 'dark-tour-container' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className={`lg:col-span-2 ${isDark ? 'dark-tour-content' : ''}`}>
            {activeTab === "overview" && (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Compass size={20} className="text-emerald-600" />
                    </span>
                    About This Tour
                  </h2>
                  <p className="text-slate-700 mb-10 text-lg leading-relaxed whitespace-pre-line">{tour.description}</p>

                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Star size={16} className="text-amber-600" />
                    </span>
                    Highlights
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    {tour.highlights?.map((highlight, index) => (
                      <li key={index} className={`flex items-start gap-3 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${isDark ? 'dark-tour-highlight' : ''}`}>
                        <span className="mt-1 text-emerald-500">
                          <Check size={16} />
                        </span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    )) || (
                      <>
                        <li className={`flex items-start gap-3 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${isDark ? 'dark-tour-highlight' : ''}`}>
                          <span className="mt-1 text-emerald-500">
                            <Check size={16} />
                          </span>
                          <span className="text-gray-700">Explore stunning natural landscapes</span>
                        </li>
                        <li className={`flex items-start gap-3 bg-gray-50 p-3 rounded-lg ${isDark ? 'dark-tour-highlight' : ''}`}>
                          <span className="mt-1 text-emerald-500">
                            <Check size={16} />
                          </span>
                          <span className="text-gray-700">Expert guided tours of local attractions</span>
                        </li>
                        <li className={`flex items-start gap-3 bg-gray-50 p-3 rounded-lg ${isDark ? 'dark-tour-highlight' : ''}`}>
                          <span className="mt-1 text-emerald-500">
                            <Check size={16} />
                          </span>
                          <span className="text-gray-700">Authentic cultural experiences</span>
                        </li>
                        <li className={`flex items-start gap-3 bg-gray-50 p-3 rounded-lg ${isDark ? 'dark-tour-highlight' : ''}`}>
                          <span className="mt-1 text-emerald-500">
                            <Check size={16} />
                          </span>
                          <span className="text-gray-700">Premium accommodations throughout your journey</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Tour Features */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Flag size={16} className="text-blue-600" />
                    </span>
                    Tour Features
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 hover:border-emerald-100 ${isDark ? 'dark-tour-card' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Calendar size={20} className="text-emerald-600" />
                        </div>
                        <div>
                        <h4 className="font-medium text-gray-800">Duration</h4>
                        <p className="text-gray-600">{tour.duration} days</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm ${isDark ? 'dark-tour-card' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Group Size</h4>
                          <p className="text-gray-600">Max {tour.maxGroupSize} people</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm ${isDark ? 'dark-tour-card' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <MapPin size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Location</h4>
                          <p className="text-gray-600">{tour.startLocation?.description || "Various locations"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm ${isDark ? 'dark-tour-card' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Clock size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Start Date</h4>
                          <p className="text-gray-600">
                            {tour.startDates && tour.startDates.length > 0 ? 
                              new Date(tour.startDates[0]).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : 
                              "Flexible dates"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "itinerary" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Flag size={16} className="text-blue-600" />
                  </span>
                  Tour Itinerary
                </h2>
                
                {tour.locations && tour.locations.length > 0 ? (
                  <div className="space-y-8">
                    {tour.locations.map((location, index) => (
                      <div
                        key={index}
                        className={`mb-8 border-l-2 border-emerald-500 pl-6 pb-2 relative ${isDark ? 'dark-tour-location' : ''}`}
                      >
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">{index + 1}</div>
                        <h3 className="text-xl font-bold mb-2">
                          Day {index + 1}:{" "}
                          {location.description || "Exploration Day"}
                        </h3>
                        <p className="text-slate-700 mb-4">
                          {location.day ||
                            "Explore the breathtaking sites and immerse yourself in the local culture."}
                        </p>
                        <div className={`bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm ${isDark ? 'dark-tour-card' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin
                              size={18}
                              className="text-emerald-500"
                            />
                            <span className="font-medium">Location:</span>
                            <span>
                              {location.description ||
                                "Various spectacular locations"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock
                              size={18}
                              className="text-emerald-500"
                            />
                            <span className="font-medium">Duration:</span>
                            <span>Full day exploration</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`bg-gray-50 p-6 rounded-lg border border-gray-100 text-center ${isDark ? 'dark-tour-card' : ''}`}>
                    <p className="text-gray-600 mb-3">
                      Detailed itinerary information will be provided upon
                      booking.
                    </p>
                    <p className="text-sm text-gray-500">
                      This tour includes professional guides and carefully planned daily activities.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "location" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-amber-600" />
                  </span>
                  Tour Locations
                </h2>
                <TourMap
                  locations={tour.locations || []}
                  startLocation={tour.startLocation}
                />
              </div>
            )}

            {activeTab === "reviews" && (
              <TourReviews tourId={tour.id} reviews={tour.reviews || []} tour={tour} />
            )}

            {activeTab === "guides" && (
              <TourGuides guides={tour.guides || []} />
            )}
            
            {activeTab === "gallery" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Camera size={18} className="text-emerald-600" />
                  </span>
                  Tour Gallery
                </h2>
                <TourGallery
                  images={
                    tour.images?.map(
                      (img) =>
                        img.startsWith('http')? img : `${process.env.NEXT_PUBLIC_API_URL}/img/tours/${img}`
                    ) || []
                  }
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <TourBooking tour={tour} />

            <div className={`mt-8 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 ${isDark ? 'dark-tour-sidebar' : ''}`}>
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>{tour.duration} days guided tour</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>
                    Accommodation in{" "}
                    {tour.difficulty === "easy"
                      ? "premium"
                      : tour.difficulty === "medium"
                      ? "comfortable"
                      : "standard"}{" "}
                    hotels
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>All breakfasts and select meals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>Professional guide throughout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>All transportation during tour</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))] font-bold">
                    ✓
                  </span>
                  <span>Entrance fees to attractions</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4">Not Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>International airfare</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Travel insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Optional activities marked as such</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Personal expenses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Tours Section */}
      <div className={`bg-gray-50 py-20 ${isDark ? 'dark-tour-container' : ''}`}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Similar Tours You Might Like</h2>
          <SimilarTours currentTourId={tour.id} difficulty={tour.difficulty} />
        </div>
      </div>
    </>
  );
}
