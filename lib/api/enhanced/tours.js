// Enhanced Tours API with caching
import { getAllTours, getTourById, getTopTours, getToursWithinDistance } from '../tours';

// Create fetch functions that can be used with the data provider
// These functions don't actually fetch the data, they just return the fetch function
// which will be executed by the data provider if needed

export const fetchAllTours = () => () => getAllTours();

export const fetchTourById = (id) => () => getTourById(id);

export const fetchTopTours = () => () => getTopTours();

export const fetchToursWithinDistance = (distance, latLng, unit) => 
  () => getToursWithinDistance(distance, latLng, unit);
