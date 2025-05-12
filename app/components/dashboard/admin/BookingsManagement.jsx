'use client';

import { useState, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw,
  Loader,
  AlertCircle,
  HelpCircle,
  Users,
  DollarSign,
  Calendar,
  Check,
  X,
  FileText
} from 'lucide-react';
// Import the enhanced API hooks
import { useData } from '@/app/providers/DataProvider';
import * as EnhancedAPI from '@/lib/api/enhanced';
import Card from '@/app/components/dashboard/Card';
import DataTable from '@/app/components/dashboard/DataTable';
import BookingForm from './forms/BookingForm';

const BookingsManagement = () => {
  // Use the data context directly for more control
  const { 
    fetchData, 
    invalidateCache, 
    loading: cacheLoading,
    errors: cacheErrors,
    cache 
  } = useData();

  const cacheKey = 'bookings/all';
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Get the bookings from cache
  const bookings = cache[cacheKey];
  const isLoading = cacheLoading[cacheKey];
  const error = cacheErrors[cacheKey];
  
  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);
  
  // Update filtered bookings when search term or bookings change
  useEffect(() => {
    if (!bookings) return;
    
    if (searchTerm.trim() === "") {
      setFilteredBookings(bookings);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredBookings(
        bookings.filter(
          booking => 
            (booking.tour?.name || '').toLowerCase().includes(lowercasedSearch) || 
            (booking.user?.name || '').toLowerCase().includes(lowercasedSearch) ||
            (booking.user?.email || '').toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, bookings]);
  
  // Function to fetch bookings
  const fetchBookings = async (force = false) => {
    try {
      await fetchData(cacheKey, EnhancedAPI.fetchAllBookings(), force);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };
  
  // Function to handle edit booking click
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsCreatingBooking(false);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle create booking click
  const handleCreateBooking = () => {
    setSelectedBooking(null);
    setIsCreatingBooking(true);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle form submission (for both edit and create)
  const handleFormSubmit = async (bookingData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (isCreatingBooking) {
        // Create a new booking
        await EnhancedAPI.createBooking(bookingData, invalidateCache);
        setSuccessMessage(`Booking created successfully`);
      } else {
        // Update an existing booking
        await EnhancedAPI.updateBooking(selectedBooking._id, bookingData, invalidateCache);
        setSuccessMessage(`Booking updated successfully`);
      }
      
      // Refresh bookings
      fetchBookings(true);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isCreatingBooking ? 'creating' : 'updating'} booking:`, err);
      setFormError(err.message || `Failed to ${isCreatingBooking ? 'create' : 'update'} booking`);
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
  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };
  
  // Function to handle booking deletion
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setFormLoading(true);
      // We need to pass the booking object to properly invalidate related caches
      await EnhancedAPI.deleteBooking(selectedBooking._id, selectedBooking, invalidateCache);
      
      // Refresh bookings
      fetchBookings(true);
      
      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
      setSuccessMessage(`Booking deleted successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setFormError(err.message || 'Failed to delete booking');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Define booking table columns
  const bookingColumns = [
    {
      id: 'tour',
      header: 'Tour',
      accessor: (booking) => booking.tour?.name || 'Unknown Tour',
      sortable: true,
      searchable: true,
      cell: (booking) => (
        <div className="flex items-center">
          <FileText size={14} className="text-emerald-600 dark:text-emerald-400 mr-2" />
          <span className="font-medium">{booking.tour?.name || 'Unknown Tour'}</span>
        </div>
      )
    },
    {
      id: 'user',
      header: 'User',
      accessor: (booking) => booking.user?.name || 'Unknown User',
      sortable: true,
      searchable: true,
      cell: (booking) => (
        <div className="flex items-center">
          <Users size={14} className="text-blue-600 dark:text-blue-400 mr-2" />
          {booking.user?.name || 'Unknown User'}
        </div>
      )
    },
    {
      id: 'price',
      header: 'Price',
      accessor: (booking) => booking.price,
      sortable: true,
      searchable: false,
      cell: (booking, { isDark } = {}) => (
        <div className="flex items-center">
          <DollarSign size={14} className={`${isDark ? 'text-green-400' : 'text-green-700'} mr-1`} />
          {booking.price}
        </div>
      )
    },
    {
      id: 'paid',
      header: 'Payment Status',
      accessor: (booking) => booking.paid,
      sortable: true,
      searchable: false,
      cell: (booking, { isDark } = {}) => (
        <div className="flex items-center">
          {booking.paid ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-200 text-green-800 border border-green-300'}`}>
              <Check size={12} className="mr-1" /> Paid
            </span>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-200 text-red-800 border border-red-300'}`}>
              <X size={12} className="mr-1" /> Unpaid
            </span>
          )}
        </div>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (booking) => booking.createdAt,
      sortable: true,
      searchable: false,
      cell: (booking) => (
        <div className="flex items-center">
          <Calendar size={14} className="text-gray-600 dark:text-gray-400 mr-1" />
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (booking) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditBooking(booking)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(booking)}
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={() => fetchBookings(true)} // Force refresh
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Refresh bookings"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreateBooking}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus size={16} className="mr-2" />
            Add Booking
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error loading bookings</h3>
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
      
      {/* Bookings Table */}
      <Card>
        {isLoading && !bookings ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>
          </div>
        ) : bookings && filteredBookings.length > 0 ? (
          <DataTable
            columns={bookingColumns}
            data={filteredBookings}
            showSearch={false}
            pagination={true}
            pageSize={10}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <HelpCircle size={40} className="text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No bookings match your search criteria' : 'No bookings found'}
            </p>
          </div>
        )}
      </Card>
      
      {/* Booking Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <BookingForm
              booking={isCreatingBooking ? null : selectedBooking}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              isLoading={formLoading}
              error={formError}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this booking for{' '}
              <span className="font-semibold">{selectedBooking.tour?.name || 'Unknown Tour'}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
