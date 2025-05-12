'use client';

import { useState, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw,
  Loader,
  AlertCircle,
  HelpCircle,
  Star,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Check
} from 'lucide-react';
// Import the data context and enhanced API services
import { useData } from '@/app/providers/DataProvider';
import * as EnhancedAPI from '@/lib/api/enhanced';
import Card from '@/app/components/dashboard/Card';
import DataTable from '@/app/components/dashboard/DataTable';
import ReviewForm from './forms/ReviewForm';

const ReviewsManagement = () => {
  // Use the data context for caching
  const { 
    fetchData, 
    invalidateCache, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();
  
  const cacheKey = 'reviews/all';
  const reviews = cache[cacheKey];
  const isLoading = cacheLoading[cacheKey];
  const error = cacheErrors[cacheKey];
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Define review table columns
  const reviewColumns = [
    {
      id: 'tour',
      header: 'Tour',
      accessor: (review) => review.tour?.name || 'Unknown Tour',
      sortable: true,
      searchable: true,
      cell: (review) => (
        <div className="flex items-center">
          <FileText size={14} className="text-emerald-600 dark:text-emerald-400 mr-2" />
          <span className="font-medium">{review.tour?.name || 'Unknown Tour'}</span>
        </div>
      )
    },
    {
      id: 'user',
      header: 'User',
      accessor: (review) => review.user?.name || 'Unknown User',
      sortable: true,
      searchable: true,
      cell: (review) => (
        <div className="flex items-center">
          <User size={14} className="text-blue-600 dark:text-blue-400 mr-2" />
          {review.user?.name || 'Unknown User'}
        </div>
      )
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: (review) => review.rating,
      sortable: true,
      searchable: false,
      cell: (review) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'} 
            />
          ))}
          <span className="ml-2 text-gray-700 dark:text-gray-300">{review.rating}</span>
        </div>
      )
    },
    {
      id: 'review',
      header: 'Review',
      accessor: (review) => review.review,
      sortable: false,
      searchable: true,
      cell: (review) => (
        <div className="flex items-start max-w-xs">
          <MessageSquare size={14} className="text-gray-600 dark:text-gray-400 mr-2 mt-1 flex-shrink-0" />
          <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
            {review.review}
          </p>
        </div>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (review) => review.createdAt,
      sortable: true,
      searchable: false,
      cell: (review) => (
        <div className="flex items-center">
          <Calendar size={14} className="text-gray-600 dark:text-gray-400 mr-1" />
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (review) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditReview(review)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(review)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];
  
  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);
  
  // Update filtered reviews when search term or reviews change
  useEffect(() => {
    if (!reviews) return;
    
    if (searchTerm.trim() === "") {
      setFilteredReviews(reviews);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredReviews(
        reviews.filter(
          review => 
            (review.tour?.name || '').toLowerCase().includes(lowercasedSearch) || 
            (review.user?.name || '').toLowerCase().includes(lowercasedSearch) ||
            (review.review || '').toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, reviews]);
  
  // Function to fetch reviews with caching
  const fetchReviews = async (force = false) => {
    try {
      // Create a fetch function for the reviews
      const fetchReviewsFunction = () => async () => {
        // Make the API call to fetch all reviews
        return await EnhancedAPI.getAllReviews();
      };
      
      // Use the data context to handle caching
      await fetchData(cacheKey, fetchReviewsFunction(), force);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };
  
  // Function to handle edit review click
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle form submission for edit
  const handleFormSubmit = async (reviewData) => {
    if (!selectedReview) return;
    
    setFormLoading(true);
    setFormError(null);
    
    try {
      // Update the review (using the enhanced API that handles cache invalidation)
      await EnhancedAPI.updateReview(selectedReview._id, reviewData, invalidateCache);
      
      // Refresh the reviews list
      fetchReviews(true);
      
      setSuccessMessage(`Review updated successfully`);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating review:', err);
      setFormError(err.message || 'Failed to update review');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormError(null);
  };
  
  // Function to handle delete click
  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };
  
  // Function to handle review deletion
  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    try {
      setFormLoading(true);
      
      // Delete the review (using the enhanced API that handles cache invalidation)
      await EnhancedAPI.deleteReview(selectedReview._id, selectedReview, invalidateCache);
      
      // Refresh the reviews list
      fetchReviews(true);
      
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
      
      setSuccessMessage('Review deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting review:', err);
      setFormError(err.message || 'Failed to delete review');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Render the component
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={() => fetchReviews(true)} // Force refresh
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Refresh reviews"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error loading reviews</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-start">
          <Check size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Success</h3>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      
      {/* Reviews Table */}
      <Card>
        {isLoading && !reviews ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews && filteredReviews.length > 0 ? (
          <DataTable
            columns={reviewColumns}
            data={filteredReviews}
            showSearch={false}
            pagination={true}
            pageSize={10}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <HelpCircle size={40} className="text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No reviews match your search criteria' : 'No reviews found'}
            </p>
          </div>
        )}
      </Card>
      
      {/* Review Edit Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ReviewForm
              review={selectedReview}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              isLoading={formLoading}
              error={formError}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this review for{' '}
              <span className="font-semibold">{selectedReview.tour?.name || 'Unknown Tour'}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
