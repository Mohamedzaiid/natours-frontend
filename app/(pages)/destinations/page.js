'use client';

import { useState, useEffect } from 'react';
import { getAllDestinations } from '@/lib/api/destinations';
import { PageHeader } from '../../components/layout/PageHeader';
import { NearbyTours } from '../../components/destinations/NearbyTours';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, User, Search, Globe, ArrowRight } from 'lucide-react';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNearbyTours, setShowNearbyTours] = useState(false);
  
  useEffect(() => {
    async function loadDestinations() {
      try {
        const destinationsData = await getAllDestinations();
        setDestinations(destinationsData);
        setFilteredDestinations(destinationsData);
        
        // Extract unique regions (simplified version - in production this would be more robust)
        const uniqueRegions = new Set();
        destinationsData.forEach(dest => {
          // Simple region extraction for demonstration
          const location = dest.location || '';
          
          // Try to extract a continent or region
          if (location.includes('Europe')) uniqueRegions.add('Europe');
          else if (location.includes('Asia')) uniqueRegions.add('Asia');
          else if (location.includes('Africa')) uniqueRegions.add('Africa');
          else if (location.includes('North America')) uniqueRegions.add('North America');
          else if (location.includes('South America')) uniqueRegions.add('South America');
          else if (location.includes('Australia')) uniqueRegions.add('Australia');
          else uniqueRegions.add('Other');
        });
        
        setRegions(['All', ...Array.from(uniqueRegions)]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading destinations:', error);
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...destinations];
    
    // Filter by region if not "All"
    if (activeRegion !== 'All') {
      filtered = filtered.filter(destination => {
        const location = destination.location || '';
        return location.includes(activeRegion);
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(destination => 
        (destination.name && destination.name.toLowerCase().includes(query)) || 
        (destination.location && destination.location.toLowerCase().includes(query))
      );
    }
    
    setFilteredDestinations(filtered);
  }, [activeRegion, searchQuery, destinations]);

  const handleRegionChange = (region) => {
    setActiveRegion(region);
  };

  const handleSearch = (e) => {
    try {
      setSearchQuery(e.target.value || '');
    } catch (error) {
      console.error('Error in search:', error);
      setSearchQuery('');
    }
  };

  const toggleNearbyTours = () => {
    setShowNearbyTours(!showNearbyTours);
  };

  return (
    <>
      <PageHeader 
        title="Explore Destinations" 
        subtitle="Discover amazing places around the world with our curated selection of travel destinations"
        backgroundImage="/hero-bg.jpg"
      />
      
      <div className="container-custom py-12">
        {/* Banner for Nearby Tours */}
        <div className="mb-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Find Tours Near You</h2>
              <p className="opacity-90">Discover amazing experiences close to your current location</p>
            </div>
            <button 
              onClick={toggleNearbyTours} 
              className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
            >
              {showNearbyTours ? 'Hide Nearby Tours' : 'Show Nearby Tours'}
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Nearby Tours Component */}
        {showNearbyTours && (
          <div className="mb-10">
            <NearbyTours />
          </div>
        )}
        
        {/* Search and Filter */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Filter by region:</span>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => handleRegionChange(region)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeRegion === region
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Destinations Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-8">
              <Globe className="text-emerald-500 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Popular Destinations</h2>
              <div className="ml-auto text-gray-600">{filteredDestinations.length} destinations found</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map(destination => (
                <Link href={`/destinations/${destination.id}`} key={destination.id}>
                  <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-60 w-full overflow-hidden">
                      {destination.image ? (
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                          <MapPin size={40} className="text-emerald-500" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent w-full h-24"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                        <div className="flex items-center text-white/80">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm">{destination.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-1" />
                          <span className="text-sm">{destination.tours.length} Tours</span>
                        </div>
                        <div className="text-emerald-600 font-medium flex items-center">
                          Explore
                          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredDestinations.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No destinations found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters to find more destinations</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
