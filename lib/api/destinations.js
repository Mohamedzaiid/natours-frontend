// API functionality for destinations
// Since there's no specific destinations endpoint, we'll extract destinations from tours

// Base API URL - adjust if needed based on your backend setup
const API_URL = 'https://natours-yslc.onrender.com/api/v1';
const BASE_URL = 'https://natours-yslc.onrender.com';
const TOURS_API = `${API_URL}/tours`;

// Helper function to extract unique destinations from tour data
function extractDestinations(tours) {
  // Create a map to store unique destinations with their details and associated tours
  const destinationsMap = new Map();
  
  tours.forEach(tour => {
    // Using startLocation as the primary destination
    if (tour.startLocation && tour.startLocation.description) {
      const description = tour.startLocation.description || 'Unknown';
      const address = tour.startLocation.address || description;
      
      // Use the description as the destination name
      const destinationName = description;
      
      if (!destinationsMap.has(destinationName)) {
        // Ensure coordinates exist and are valid
        let coordinates = { latitude: 0, longitude: 0 };
        if (tour.startLocation.coordinates && Array.isArray(tour.startLocation.coordinates) && tour.startLocation.coordinates.length >= 2) {
          coordinates = {
            latitude: tour.startLocation.coordinates[1],
            longitude: tour.startLocation.coordinates[0],
          };
        }
        
        destinationsMap.set(destinationName, {
          id: destinationName.toLowerCase().replace(/\s+/g, '-'),
          name: destinationName,
          location: address,
          coordinates,
          tours: [tour],
          image: tour.imageCover,
          count: 1
        });
      } else {
        // Update existing destination
        const existing = destinationsMap.get(destinationName);
        existing.tours.push(tour);
        existing.count += 1;
        
        // If this tour has a better image, use it
        if (!existing.image && tour.imageCover) {
          existing.image = tour.imageCover;
        }
      }
    }
    
    // Also add locations from the tour
    if (tour.locations && Array.isArray(tour.locations)) {
      tour.locations.forEach(location => {
        // Skip if location has no description
        if (!location || !location.description) return;
        
        const destinationName = location.description;
        
        if (!destinationsMap.has(destinationName)) {
          // Ensure coordinates exist and are valid
          let coordinates = { latitude: 0, longitude: 0 };
          if (location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
            coordinates = {
              latitude: location.coordinates[1],
              longitude: location.coordinates[0],
            };
          }
          
          destinationsMap.set(destinationName, {
            id: destinationName.toLowerCase().replace(/\s+/g, '-'),
            name: destinationName,
            location: location.description,
            coordinates,
            tours: [tour],
            image: tour.imageCover,
            count: 1
          });
        } else {
          // Update existing destination if this tour isn't already counted
          const existing = destinationsMap.get(destinationName);
          if (!existing.tours.find(t => t.id === tour.id)) {
            existing.tours.push(tour);
            existing.count += 1;
          }
        }
      });
    }
  });
  
  // Convert map to array
  return Array.from(destinationsMap.values());
}

// Function to get featured destinations (most popular based on tour count)
export async function getFeaturedDestinations(limit = 6) {
  try {
    const response = await fetch(TOURS_API);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const tours = data.data.data;
    
    // Process tours to fix image URLs
    const processedTours = tours.map(tour => ({
      ...tour,
      imageCover: tour.imageCover ? `${BASE_URL}/img/tours/${tour.imageCover}` : null,
      images: tour.images ? tour.images.map(img => `${BASE_URL}/img/tours/${img}`) : []
    }));
    
    // Extract destinations
    const destinations = extractDestinations(processedTours);
    
    // Sort by tour count (popularity) and take the specified limit
    return destinations
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// Function to get all destinations
export async function getAllDestinations() {
  try {
    const response = await fetch(TOURS_API);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const tours = data.data.data;
    
    // Process tours to fix image URLs
    const processedTours = tours.map(tour => ({
      ...tour,
      imageCover: tour.imageCover ? `${BASE_URL}/img/tours/${tour.imageCover}` : null,
      images: tour.images ? tour.images.map(img => `${BASE_URL}/img/tours/${img}`) : []
    }));
    
    // Extract destinations
    return extractDestinations(processedTours);
      
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// Function to get a destination by its ID (slug)
export async function getDestinationById(id) {
  try {
    const allDestinations = await getAllDestinations();
    return allDestinations.find(destination => destination.id === id) || null;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    throw error;
  }
}

// Function to get destinations by continent (inferred from location description)
export async function getDestinationsByRegion(region) {
  try {
    const allDestinations = await getAllDestinations();
    
    // Simple filtering based on location name containing the region
    // In a real app, you might have more robust region/continent data
    return allDestinations.filter(
      destination => destination.location.toLowerCase().includes(region.toLowerCase())
    );
  } catch (error) {
    console.error(`Error fetching destinations for region ${region}:`, error);
    throw error;
  }
}
