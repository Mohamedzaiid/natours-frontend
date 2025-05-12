'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { getAllTours } from '@/lib/api/admin';
import { getAllUsers } from '@/lib/api/admin';

const BookingForm = ({ booking, onSubmit, onCancel, isLoading, error }) => {
  // Form state
  const [formData, setFormData] = useState({
    tour: '',
    user: '',
    price: '',
    paid: true
  });
  
  // Available tours and users for selection
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading state for tours and users
  const [toursLoading, setToursLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Fetch tours and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tours
        setToursLoading(true);
        const toursData = await getAllTours();
        setTours(toursData);
        setToursLoading(false);
        
        // Fetch users
        setUsersLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
        setUsersLoading(false);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setToursLoading(false);
        setUsersLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Set form data when editing an existing booking
  useEffect(() => {
    if (booking) {
      setFormData({
        tour: booking.tour?._id || '',
        user: booking.user?._id || '',
        price: booking.price || '',
        paid: booking.paid !== false // true by default unless explicitly false
      });
    }
  }, [booking]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.tour) {
      alert('Please select a tour');
      return;
    }
    
    if (!formData.user) {
      alert('Please select a user');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    // Submit form data
    onSubmit(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {booking ? 'Edit Booking' : 'Create New Booking'}
        </h3>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tour Selection */}
        <div>
          <label htmlFor="tour" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tour
          </label>
          <div className="relative">
            <select
              id="tour"
              name="tour"
              value={formData.tour}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isLoading || toursLoading}
              required
            >
              <option value="" disabled>Select a tour</option>
              {tours.map(tour => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
            </select>
            {toursLoading && (
              <div className="absolute right-3 top-2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* User Selection */}
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User
          </label>
          <div className="relative">
            <select
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isLoading || usersLoading}
              required
            >
              <option value="" disabled>Select a user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {usersLoading && (
              <div className="absolute right-3 top-2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        {/* Paid Status */}
        <div className="flex items-center">
          <input
            id="paid"
            name="paid"
            type="checkbox"
            checked={formData.paid}
            onChange={handleChange}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            disabled={isLoading}
          />
          <label htmlFor="paid" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Paid
          </label>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader size={16} className="animate-spin mr-2" />
                {booking ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{booking ? 'Update Booking' : 'Create Booking'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
