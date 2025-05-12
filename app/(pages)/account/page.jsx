'use client';


  const BASE_URL = 'https://natours-yslc.onrender.com';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useWishlist } from '@/app/hooks/useWishlist';
import { updateTabInUrl } from './utils';
import { updateUserData, updatePassword as updateUserPassword } from '@/lib/api/auth';
import Link from 'next/link';
import Image from 'next/image';
import Avatar from '@/app/components/ui/Avatar';
import WishlistCard from '@/app/components/ui/wishlist/WishlistCard';
import { 
  User, 
  Settings, 
  CreditCard, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CalendarDays,
  Mail,
  Phone,
  Shield,
  Edit,
  Check,
  Loader2,
  LogOut,
  Clock,
  Camera,
  Lock,
  AlertTriangle,
  ChevronRight,
  Star
} from 'lucide-react';

  // Function to update URL with tab parameter
  const updateActiveTab = (tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', message: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', message: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const router = useRouter();

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || 'default.jpg',
      });
    }
  }, [user, isAuthenticated, loading, router]);
  
  // Check for tab parameter in URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'bookings', 'wishlist', 'billing', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', photoFile);

    try {
      // Use our catch-all upload proxy
      const response = await fetch('/api/upload/users/update-me', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setUpdateMessage({
          type: 'success',
          message: 'Profile photo updated successfully!'
        });
        
        // Trigger a page refresh to load updated photo
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.message || 'Failed to update profile photo');
      }
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        message: error.message || 'Failed to update profile photo. Please try again.'
      });
    } finally {
      setIsUploadingPhoto(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage({ type: '', message: '' });

    try {
      const result = await updateUserData({
        name: formData.name,
        email: formData.email
      });
      
      if (result.status === 'success') {
        setUpdateMessage({ 
          type: 'success', 
          message: 'Profile updated successfully!' 
        });
      }
    } catch (error) {
      setUpdateMessage({ 
        type: 'error', 
        message: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, password, passwordConfirm } = passwordData;
    
    if (password !== passwordConfirm) {
      setPasswordMessage({
        type: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    if (password.length < 8) {
      setPasswordMessage({
        type: 'error',
        message: 'Password must be at least 8 characters long'
      });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage({ type: '', message: '' });

    try {
      const result = await updateUserPassword(
        currentPassword,
        password,
        passwordConfirm
      );

      if (result.status === 'success') {
        setPasswordMessage({
          type: 'success',
          message: 'Password updated successfully!'
        });
        setPasswordData({
          currentPassword: '',
          password: '',
          passwordConfirm: ''
        });
        // Hide password form after successful update
        setTimeout(() => {
          setShowPasswordForm(false);
        }, 2000);
      }
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        message: error.message || 'Failed to update password. Please try again.'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const userBookings = [
    {
      id: 'tour-1',
      name: 'The Forest Hiker',
      date: '2025-04-25',
      duration: '5 days',
      price: '$397',
      status: 'upcoming',
      image: '/img/tours/Forest.jpg'
    },
    {
      id: 'tour-2',
      name: 'The Sea Explorer',
      date: '2024-12-15',
      duration: '7 days',
      price: '$497',
      status: 'completed',
      image: '/img/tours/Beach.jpg'
    }
  ];

  const userWishlist = [
    {
      id: 'tour-3',
      name: 'The Snow Adventurer',
      price: '$597',
      rating: 4.9,
      reviews: 28,
      image: '/img/tours/Mountain.jpg'
    },
    {
      id: 'tour-4',
      name: 'The City Wanderer',
      price: '$297',
      rating: 4.8,
      reviews: 23,
      image: '/img/tours/Hiking.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* Account Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-400 relative">
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-4 md:mb-0 md:mr-6 z-10">
                  <Avatar 
                    src={user?.photo || 'default-user.jpg'}
                    alt={user?.name || 'User'}
                    size="2xl"
                    className="border-4 border-white shadow-md"
                  />
                </div>
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.name}</h1>
                  <div className="flex items-center justify-center md:justify-start text-gray-500 mt-2">
                    <Mail size={14} className="mr-1 mt-5" />
                    <p className='pt-5'>{user?.email}</p>
                  </div>
                  {user?.role && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {user?.role === 'admin' && (
                  <Link href="/dashboard" className="flex items-center space-x-1 rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link href="/tours" className="flex items-center space-x-1 rounded-lg px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <ShoppingBag size={16} />
                  <span>Book Tour</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 rounded-lg px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-gray-900 dark:text-white">
              <nav className="space-y-1">
                <button
                   onClick={() => {
                    setActiveTab('profile');
                    updateTabInUrl('profile');
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg ${activeTab === 'profile'
                     ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                     : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <User size={20} />
                  <span>My Profile</span>
                </button>
                <button
                   onClick={() => {
                    setActiveTab('bookings');
                    updateTabInUrl('bookings');
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg ${activeTab === 'bookings'
                     ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                     : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <CalendarDays size={20} />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('wishlist');
                    updateTabInUrl('wishlist');
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg ${activeTab === 'wishlist'
                     ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                     : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <Heart size={20} />
                  <span>My Wishlist</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('billing');
                    updateTabInUrl('billing');
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg ${activeTab === 'billing'
                     ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                     : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Billing</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    updateTabInUrl('settings');
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg ${activeTab === 'settings'
                     ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                     : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-gray-900 dark:text-white">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">My Profile</h2>
                
                {updateMessage.message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    updateMessage.type === 'success' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {updateMessage.type === 'success' ? (
                      <div className="flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        {updateMessage.message}
                      </div>
                    ) : (
                      updateMessage.message
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative mb-4 group">
                        <div className="relative">
                          {photoPreview ? (
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-green-100">
                              <Image 
                                src={photoPreview}
                                alt={user?.name || 'User'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar 
                              src={user?.photo || 'default-user.jpg'}
                              alt={user?.name || 'User'}
                              size="2xl"
                              className="border-4 border-green-100"
                            />
                          )}
                          <label htmlFor="photo-upload" className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} className="text-white" />
                          </label>
                        </div>
                        <input 
                          type="file" 
                          id="photo-upload" 
                          name="photo" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handlePhotoChange}
                        />
                      </div>
                      
                      {photoPreview && (
                        <div className="flex space-x-3 mb-4">
                          <button 
                            type="button" 
                            onClick={handlePhotoUpload}
                            disabled={isUploadingPhoto}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg flex items-center hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {isUploadingPhoto ? (
                              <>
                                <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                Uploading...
                              </>
                            ) : (
                              <>Save Photo</>
                            )}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      
                      {!photoPreview && (
                        <label htmlFor="photo-upload" className="text-sm text-green-600 flex items-center cursor-pointer hover:text-green-700">
                          <Edit size={14} className="mr-1" />
                          Change Photo
                        </label>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex justify-center items-center w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">My Bookings</h2>
                
                <div className="space-y-6">
                  {user.bookings.length > 0 ? user.bookings.map(booking => (
                    <div 
                      key={booking._id} 
                      className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="relative w-full md:w-48 h-48">
                        <Image
                          src={booking.tour.imageCover?.startsWith('http')? booking.tour.imageCover :`${BASE_URL}/img/tours/${booking.tour.imageCover}`}
                          alt={booking.tour.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-lg font-semibold">{booking.tour.name}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center">
                            <CalendarDays size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{booking.tour.startDates[2].split('T')[0]}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{booking.tour.duration} days</span>
                          </div>
                          <div className="font-semibold">{booking.tour.price}$</div>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <Link 
                            href={`/tours/${booking.tour._id}`}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            View Details
                          </Link>
                          {booking.paid === true && (
                            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 col-span-3">
                      <CalendarDays size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your Booking is empty</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Book a tour you love by clicking Explore Tours</p>
                      <Link href="/tours" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Explore Tours
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length > 0 ? wishlistItems.map(tour => (
                    <WishlistCard key={tour.id} tour={tour} />
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 col-span-3">
                      <Heart size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Save tours you love by clicking the heart icon</p>
                      <Link href="/tours" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Explore Tours
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Billing Information</h2>
                
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Payment Methods</h3>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CreditCard size={16} className="mr-2" />
                        Add New
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center justify-between p-6 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md mr-4 flex items-center justify-center text-white font-bold shadow-sm">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium flex items-center">
                            <span className="mr-2">Visa ending in 4242</span>
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Primary</span>
                          </p>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <p className="mr-3">Expires 04/2026</p>
                            <p>Updated 2 months ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 border border-red-200 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-12 w-16 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-md mr-4 flex items-center justify-center text-white font-bold shadow-sm">
                          MC
                        </div>
                        <div>
                          <p className="font-medium">MasterCard ending in 5678</p>
                          <div className="flex mt-1 text-sm text-gray-500">
                            <p className="mr-3">Expires 08/2028</p>
                            <p>Updated 2 weeks ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 border border-red-200 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Billing Address</h3>
                      <button className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <Edit size={16} className="mr-2" />
                        Edit Address
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3 text-green-600">
                          <MapPin size={18} />
                        </div>
                        <address className="not-italic">
                          <p className="font-medium mb-1">John Doe</p>
                          <p className="text-gray-600 mb-1">123 Main Street</p>
                          <p className="text-gray-600 mb-1">New York, NY 10001</p>
                          <p className="text-gray-600 mb-1">United States</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Phone size={14} className="mr-1" />
                            <span>+1 (555) 123-4567</span>
                          </div>
                        </address>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 flex items-start">
                      <div className="shrink-0 mt-0.5 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Your billing address is used for tax calculations</p>
                        <p className="mt-1 text-sm">Please ensure this address matches the billing address on your credit card statement for successful payments.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">Password</h3>
                        <p className="text-gray-600">Update your password to keep your account secure.</p>
                      </div>
                      {!showPasswordForm && (
                        <button 
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <Lock size={16} className="mr-2" />
                          Change Password
                        </button>
                      )}
                    </div>

                    {passwordMessage.message && (
                      <div className={`mb-6 p-4 rounded-lg ${
                        passwordMessage.type === 'success' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {passwordMessage.type === 'success' ? (
                          <div className="flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            {passwordMessage.message}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            {passwordMessage.message}
                          </div>
                        )}
                      </div>
                    )}

                    {showPasswordForm && (
                      <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={passwordData.password}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                        </div>
                        <div>
                          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            value={passwordData.passwordConfirm}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="flex justify-center items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {isUpdatingPassword ? (
                              <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Updating...
                              </>
                            ) : (
                              'Update Password'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordMessage({ type: '', message: '' });
                              setPasswordData({
                                currentPassword: '',
                                password: '',
                                passwordConfirm: ''
                              });
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-gray-500">Receive emails about new tours and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center text-red-600">
                      <Shield size={20} className="mr-2" />
                      Danger Zone
                    </h3>
                    <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
