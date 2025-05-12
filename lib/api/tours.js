// API functionality for tours
import { mockTours } from './mockData';

// Base API URL - adjust if needed based on your backend setup
const API_URL = 'https://natours-yslc.onrender.com/api/v1';
const BASE_URL = 'https://natours-yslc.onrender.com';
const TOURS_API = `${API_URL}/tours`;

// Helper function to process tour data and fix image URLs
function processToursData(tours) {
  if (!Array.isArray(tours)) {
    // If it's a single tour, convert to array, process, and return first element
    const processed = processToursData([tours]);
    return processed[0];
  }
  
  return tours.map(tour => ({
    ...tour,
    imageCover: tour.imageCover.startsWith('http') ? tour.imageCover :`${BASE_URL}/img/tours/${tour.imageCover}` ,
    images: tour.images ? tour.images.map(img => img.startsWith('http') ? img : `${BASE_URL}/img/tours/${img}`) : []
  }));
}

// Get all tours
export async function getAllTours() {
  try {
    const response = await fetch(TOURS_API);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const tours = data.data.data;
    return processToursData(tours); // Process tour data to fix image URLs
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
}

// Get a specific tour by ID
export async function getTourById(id) {
  try {
    const response = await fetch(`${TOURS_API}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const tour = data.data.data;
    return processToursData(tour); // Process tour data to fix image URLs
  } catch (error) {
    console.error(`Error fetching tour with ID ${id}:`, error);
    throw error;
  }
}

// Get top rated tours
export async function getTopTours() {
  try {
    const response = await fetch(`${TOURS_API}/top-5-cheap`);
    
    if (!response.ok) {
      console.warn(`Falling back to mock data - API responded with: ${response.status}`);
      return processToursData(mockTours); // Use mock data if API fails
    }
    
    const data = await response.json();
    const tours = data.data.data;
    return processToursData(tours); // Process tour data to fix image URLs
  } catch (error) {
    console.error('Error fetching top tours, using fallback data:', error);
    return processToursData(mockTours); // Use mock data on any error
  }
}

// Get tours within a certain distance from coordinates
export async function getToursWithinDistance(distance, latLng, unit = 'mi') {
  try {
    // Validate inputs
    if (!latLng || typeof latLng !== 'string') {
      console.error('Invalid latLng parameter:', latLng);
      return [];
    }
    
    const [lat, lng] = latLng.split(',');
    
    // Check if lat and lng are valid numbers
    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      console.error('Invalid coordinates:', lat, lng);
      return [];
    }
    
    const response = await fetch(`${TOURS_API}/tour-within/${distance}/center/${lat},${lng}/unit/${unit}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const tours = data.data.data;
    return processToursData(tours || []); // Process tour data to fix image URLs and handle empty response
  } catch (error) {
    console.error('Error fetching tours within distance:', error);
    return []; // Return empty array instead of throwing to avoid crashing the UI
  }
}
