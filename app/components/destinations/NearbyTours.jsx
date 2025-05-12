'use client';

import { useState, useEffect } from 'react';
import { getToursWithinDistance } from '@/lib/api/tours';
import { MapPin, Calendar, Clock, Star, Users, ChevronRight, Locate } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function NearbyTours() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [nearbyTours, setNearbyTours] = useState([]);
  const [distance, setDistance] = useState(5000200);
  const [unit, setUnit] = useState('mi');

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchNearbyTours(`${latitude},${longitude}`, distance, unit);
        },
        error => {
          console.error('Error getting location:', error);
          setError('Could not determine your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  // Fetch nearby tours when distance or unit changes
  useEffect(() => {
    if (location) {
      fetchNearbyTours(`${location.latitude},${location.longitude}`, distance, unit);
    }
  }, [distance, unit]);

  const fetchNearbyTours = async (latLng, dist, unit) => {
    try {
      setLoading(true);
      // Ensure latLng is properly formatted
      if (!latLng || typeof latLng !== 'string' || !latLng.includes(',')) {
        throw new Error('Invalid location format');
      }
      const [lat, lng] = latLng.split(',');
      if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
        throw new Error('Invalid coordinates');
      }
      const tours = await getToursWithinDistance(dist, latLng, unit);
      setNearbyTours(tours || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching nearby tours:', err);
      setError('Failed to fetch nearby tours. Please try again later.');
      setLoading(false);
    }
  };

  const handleDistanceChange = (event) => {
    setDistance(parseInt(event.target.value));
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <MapPin className="text-red-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Tours Near Me</h2>
        </div>
        <div className="p-6 bg-red-50 rounded-md">
          <p className="text-red-600">{error}</p>
          <p className="mt-3">Please enable location services in your browser and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center mb-8">
        <MapPin className="text-emerald-500 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Tours Near Me</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
            Distance
          </label>
          <select 
            id="distance" 
            value={distance} 
            onChange={handleDistanceChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="500">500</option>
            <option value="2000">2000</option>
            <option value="3000">3000</option>
            <option value="4000">4000</option>
            <option value="5000200">5000</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select 
            id="unit" 
            value={unit} 
            onChange={handleUnitChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="mi">Miles</option>
            <option value="km">Kilometers</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : nearbyTours.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tours found nearby</h3>
          <p className="mt-1 text-gray-500">Try increasing the distance or changing the unit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearbyTours.map((tour) => (
            <Link key={tour.id} href={`/tours/${tour.id}`} className="block group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                <div className="relative h-48 w-full overflow-hidden">
                  {tour.imageCover ? (
                    <Image
                      src={tour.imageCover}
                      alt={tour.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                      <MapPin size={32} className="text-emerald-500" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-emerald-600 shadow-md">
                    {tour.difficulty}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{tour.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{tour.summary}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-emerald-500 mr-1" />
                      <span className="text-xs text-gray-600">{tour.startLocation?.description}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-emerald-500 mr-1" />
                      <span className="text-xs text-gray-600">{tour.duration} days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{tour.ratingsAverage.toFixed(1)}</span>
                      <span className="text-xs text-gray-500 ml-1">({tour.ratingsQuantity})</span>
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      From ${tour.price}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
