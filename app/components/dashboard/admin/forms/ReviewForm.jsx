'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Star } from 'lucide-react';

const ReviewForm = ({ review, onSubmit, onCancel, isLoading, error }) => {
  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    review: ''
  });
  
  // Set form data when editing an existing review
  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating || 5,
        review: review.review || ''
      });
    }
  }, [review]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };
  
  // Handle rating click
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.review.trim()) {
      alert('Please enter a review');
      return;
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }
    
    // Submit form data
    onSubmit(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Review
        </h3>
      </div>
      
      {/* Review Info */}
      {review && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tour</p>
              <p className="text-gray-900 dark:text-white">{review.tour?.name || 'Unknown Tour'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User</p>
              <p className="text-gray-900 dark:text-white">{review.user?.name || 'Unknown User'}</p>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="focus:outline-none"
              >
                <Star 
                  size={24} 
                  className={`${formData.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                             hover:text-yellow-500 transition-colors cursor-pointer`} 
                />
              </button>
            ))}
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {formData.rating}/5
            </span>
          </div>
          <input
            type="hidden"
            name="rating"
            value={formData.rating}
          />
        </div>
        
        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={5}
            className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3"
            placeholder="Enter review..."
            disabled={isLoading}
            required
          />
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
                Updating...
              </span>
            ) : (
              <span>Update Review</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
