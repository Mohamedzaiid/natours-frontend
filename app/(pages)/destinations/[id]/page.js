'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDestinationById } from '@/lib/api/destinations';
import { MapPin, Calendar, Clock, Users, Star, ArrowRight } from 'lucide-react';
import TourCard from '@/app/components/tours/TourCard';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDestination() {
      try {
        const destinationData = await getDestinationById(id);
        setDestination(destinationData);
        setLoading(false);
      } catch (error) {
        console.error(`Error loading destination with ID ${id}:`, error);
        setLoading(false);
      }
    }

    if (id) {
      loadDestination();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-2">Destination not found</h1>
        <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist.</p>
        <Link 
          href="/destinations" 
          className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
        >
          Browse All Destinations
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
            <MapPin size={60} className="text-emerald-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center justify-center text-lg">
              <MapPin size={18} className="mr-2" />
              <span>{destination.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Destination Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">About {destination.name}</h2>
            <p className="text-gray-700 mb-6">
              {destination.name} is a stunning destination located in {destination.location}. 
              Known for its natural beauty and unique experiences, it offers travelers a chance to 
              explore and create unforgettable memories.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Why Visit {destination.name}?</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className="rounded-full bg-emerald-100 p-1">
                    <Star size={16} className="text-emerald-500" />
                  </div>
                </div>
                <span className="text-gray-700">
                  Experience the unique culture and traditions that make this destination special
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className="rounded-full bg-emerald-100 p-1">
                    <Star size={16} className="text-emerald-500" />
                  </div>
                </div>
                <span className="text-gray-700">
                  Discover breathtaking landscapes and natural wonders 
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <div className="rounded-full bg-emerald-100 p-1">
                    <Star size={16} className="text-emerald-500" />
                  </div>
                </div>
                <span className="text-gray-700">
                  Enjoy a variety of activities from relaxation to adventure
                </span>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-4">Best Time to Visit</h3>
            <p className="text-gray-700 mb-6">
              The best time to visit {destination.name} depends on your preferences. 
              The high season offers beautiful weather but more crowds, while the 
              shoulder seasons provide a nice balance of good weather and fewer tourists.
            </p>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Destination Facts</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={20} className="text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-gray-600">{destination.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar size={20} className="text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Available Tours</h4>
                    <p className="text-gray-600">{destination.tours.length} tours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Avg. Tour Duration</h4>
                    <p className="text-gray-600">
                      {Math.round(destination.tours.reduce((sum, tour) => sum + (tour.duration || 0), 0) / destination.tours.length)} days
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users size={20} className="text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Group Size</h4>
                    <p className="text-gray-600">Varies by tour</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  href={`#tours`}
                  className="block w-full py-3 bg-emerald-500 text-white text-center rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  View Available Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tours Section */}
        <div id="tours" className="pt-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Tours in {destination.name}</h2>
            <Link href="/tours" className="text-emerald-600 font-medium flex items-center">
              View All Tours <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.tours.slice(0, 6).map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          
          {destination.tours.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No tours available</h3>
              <p className="text-gray-600 mb-6">There are currently no tours available for this destination.</p>
              <Link 
                href="/tours" 
                className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
              >
                Browse All Tours
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
