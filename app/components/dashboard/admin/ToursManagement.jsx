'use client';

import { useState, useEffect } from 'react';
import { 
  Map, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw,
  Star,
  Users,
  Calendar,
  DollarSign,
  Loader,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  Image,
  Check
} from 'lucide-react';
// Import enhanced tours hook instead of direct API calls
import { useData } from '@/app/providers/DataProvider';
import * as EnhancedAPI from '@/lib/api/enhanced';
import TourForm from './forms/TourForm';
import Card from '@/app/components/dashboard/Card';
import DataTable from '@/app/components/dashboard/DataTable';

const ToursManagement = () => {
  // Use the data context directly for more control over caching
  const { 
    fetchData, 
    invalidateCache, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();
  
  const cacheKey = 'tours/admin/all';
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTours, setFilteredTours] = useState([]);
  
  // Get the tours from cache
  const tours = cache[cacheKey];
  const isLoading = cacheLoading[cacheKey];
  const error = cacheErrors[cacheKey];
  
  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);
  
  // Update filtered tours when search term or tours change
  useEffect(() => {
    if (!tours) return;
    
    if (searchTerm.trim() === "") {
      setFilteredTours(tours);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredTours(
        tours.filter(
          tour => 
            tour.name.toLowerCase().includes(lowercasedSearch) || 
            tour.difficulty.toLowerCase().includes(lowercasedSearch) ||
            (tour.summary && tour.summary.toLowerCase().includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, tours]);
  
  // Function to fetch tours
  const fetchTours = async (force = false) => {
    try {
      await fetchData(cacheKey, EnhancedAPI.fetchAllToursAdmin(), force);
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  };
  
  // Function to handle edit tour click
  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setIsCreatingTour(false);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle create tour click
  const handleCreateTour = () => {
    setSelectedTour(null);
    setIsCreatingTour(true);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle form submission (for both edit and create)
  const handleFormSubmit = async (tourData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (isCreatingTour) {
        // Create a new tour
        await EnhancedAPI.createTour(tourData, invalidateCache);
        setSuccessMessage(`Tour "${tourData.name}" created successfully`);
      } else {
        // Update an existing tour
        await EnhancedAPI.updateTour(selectedTour._id, tourData, invalidateCache);
        setSuccessMessage(`Tour "${tourData.name}" updated successfully`);
      }
      
      // Refresh the tours list
      fetchTours(true);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isCreatingTour ? 'creating' : 'updating'} tour:`, err);
      setFormError(err.message || `Failed to ${isCreatingTour ? 'create' : 'update'} tour`);
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
  const handleDeleteClick = (tour) => {
    setSelectedTour(tour);
    setIsDeleteModalOpen(true);
  };
  
  // Function to handle tour deletion
  const handleDeleteTour = async () => {
    if (!selectedTour) return;
    
    try {
      setFormLoading(true);
      await EnhancedAPI.deleteTour(selectedTour._id, invalidateCache);
      
      // Refresh the tours list
      fetchTours(true);
      
      setIsDeleteModalOpen(false);
      setSelectedTour(null);
      setSuccessMessage(`Tour "${selectedTour.name}" deleted successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting tour:', err);
      setFormError(err.message || 'Failed to delete tour');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Define tour table columns
  const tourColumns = [
    {
      id: 'imageCover',
      header: '',
      accessor: (tour) => tour.imageCover,
      cell: (tour) => (
        <div className="relative w-16 h-12 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
          {tour.imageCover ? (
            <img
            src={tour.imageCover.startsWith('http') ? 
            tour.imageCover : 
            `https://natours-yslc.onrender.com/img/tours/${tour.imageCover}`}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
          )}
        </div>
      ),
      width: '80px'
    },
    {
      id: 'name',
      header: 'Tour Name',
      accessor: (tour) => tour.name,
      sortable: true,
      searchable: true
    },
    {
      id: 'price',
      header: 'Price',
      accessor: (tour) => tour.price,
      sortable: true,
      searchable: false,
      cell: (tour, { isDark } = {}) => (
        <div className="flex items-center">
          <DollarSign size={14} className={`${isDark ? 'text-green-400' : 'text-green-700'} mr-1`} />
          {tour.price}
        </div>
      )
    },
    {
      id: 'duration',
      header: 'Duration',
      accessor: (tour) => tour.duration,
      sortable: true,
      searchable: false,
      cell: (tour) => (
        <div className="flex items-center">
          <Clock size={14} className="text-blue-600 dark:text-blue-400 mr-1" />
          {tour.duration} days
        </div>
      )
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      accessor: (tour) => tour.difficulty,
      sortable: true,
      searchable: true,
      cell: (tour, { isDark } = {}) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          tour.difficulty === 'easy'
            ? isDark 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-green-200 text-green-800 border border-green-300'
            : tour.difficulty === 'medium'
              ? isDark 
                ? 'bg-yellow-900/30 text-yellow-300' 
                : 'bg-yellow-200 text-yellow-800 border border-yellow-300'
              : isDark 
                ? 'bg-red-900/30 text-red-300' 
                : 'bg-red-200 text-red-800 border border-red-300'
        }`}>
          {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
        </span>
      )
    },
    {
      id: 'maxGroupSize',
      header: 'Group Size',
      accessor: (tour) => tour.maxGroupSize,
      sortable: true,
      searchable: false,
      cell: (tour) => (
        <div className="flex items-center">
          <Users size={14} className="text-gray-600 dark:text-gray-400 mr-1" />
          {tour.maxGroupSize}
        </div>
      )
    },
    {
      id: 'ratingsAverage',
      header: 'Rating',
      accessor: (tour) => tour.ratingsAverage,
      sortable: true,
      searchable: false,
      cell: (tour) => (
        <div className="flex items-center">
          <Star size={14} className="text-yellow-500 mr-1" />
          <span>{tour.ratingsAverage}</span>
          <span className="text-gray-500 text-xs ml-1">({tour.ratingsQuantity})</span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (tour) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditTour(tour)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(tour)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];
  
  // Render the component
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tour Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={() => fetchTours(true)} // Force refresh
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Refresh tours"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreateTour}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus size={16} className="mr-2" />
            Add Tour
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error loading tours</h3>
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
      
      {/* Tours Table */}
      <Card>
        {isLoading && !tours ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading tours...</p>
          </div>
        ) : tours && filteredTours.length > 0 ? (
          <DataTable
            columns={tourColumns}
            data={filteredTours}
            showSearch={false}
            pagination={true}
            pageSize={10}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <HelpCircle size={40} className="text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No tours match your search criteria' : 'No tours found'}
            </p>
          </div>
        )}
      </Card>
      
      {/* Tour Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <TourForm
              tour={isCreatingTour ? null : selectedTour}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              isLoading={formLoading}
              error={formError}
              // Enable guides feature
              withGuides={true}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTour && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the tour <span className="font-semibold">{selectedTour.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTour}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete Tour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursManagement;
