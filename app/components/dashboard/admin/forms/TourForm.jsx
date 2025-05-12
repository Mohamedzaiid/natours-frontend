'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { getAllGuides } from '@/lib/api/admin';
import GuidesSection from './GuidesSection';
import { 
  Map,
  Compass,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
  Image as ImageIcon,
  Layers,
  Tag,
  Star,
  Info,
  Check,
  X,
  AlertCircle,
  Loader,
  Plus,
  Trash,
  Users as UsersIcon,
  Search,
  CheckCircle2
} from 'lucide-react';

// Tour form component for creating and editing tours
const TourForm = ({
  tour = null,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  withGuides = false
}) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);
  const isEditMode = !!tour;
  
  // Initial form state
  const initialFormState = {
    name: '',
    duration: 1,
    maxGroupSize: 10,
    difficulty: 'medium',
    price: 0,
    priceDiscount: 0,
    summary: '',
    description: '',
    imageCover: null,
    images: [],
    startDates: [''],
    // Start location is a GeoJSON Point
    startLocation: {
      type: 'Point',
      description: '',
      address: '',
      coordinates: [0, 0]
    },
    locations: [
      {
        type: 'Point',
        description: '',
        day: 1,
        coordinates: [0, 0]
      }
    ],
    guides: []
  };
  
  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // File upload preview states
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  
  // Guide selection states
  const [availableGuides, setAvailableGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [searchGuidesTerm, setSearchGuidesTerm] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  
  // Active tab for tour form sections
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  
  // Initialize form with tour data if in edit mode
  useEffect(() => {
    if (tour) {
      // Transform tour data to match form structure
      let formattedTour = { 
        ...initialFormState,  // Start with all default values
        ...tour,             // Override with existing tour data
        // Ensure numeric fields have valid values
        price: tour.price || 0,
        priceDiscount: tour.priceDiscount || 0,
        duration: tour.duration || 1,
        maxGroupSize: tour.maxGroupSize || 10,
      };
      
      // Set default arrays if they don't exist
      formattedTour.startDates = tour.startDates || [''];
      formattedTour.images = tour.images || [];
      formattedTour.locations = tour.locations || [
        {
          type: 'Point',
          description: '',
          day: 1,
          coordinates: [0, 0]
        }
      ];
      
      // Ensure startLocation exists and has valid structure
      formattedTour.startLocation = {
        type: 'Point',
        description: tour.startLocation?.description || '',
        address: tour.startLocation?.address || '',
        coordinates: tour.startLocation?.coordinates || [0, 0]
      };
      
      // Ensure locations have type field
      if (formattedTour.locations && Array.isArray(formattedTour.locations)) {
        formattedTour.locations = formattedTour.locations.map(loc => ({
          type: 'Point',
          description: loc.description || '',
          day: loc.day || 1,
          coordinates: loc.coordinates || [0, 0]
        }));
      }
      
      // Ensure guides is an array
      formattedTour.guides = Array.isArray(tour.guides) 
        ? tour.guides.map(guide => typeof guide === 'object' ? guide._id : guide) 
        : [];
      
      // Set image previews for edit mode
      if (tour.imageCover) {
        // Check if imageCover is a full URL (Cloudinary) or just a filename
        setCoverImagePreview(tour.imageCover.startsWith('http') ? 
          tour.imageCover : 
          `https://natours-yslc.onrender.com/img/tours/${tour.imageCover}`);
      }
      
      if (tour.images && tour.images.length > 0) {
        const previews = tour.images.map(img => {
          // Check if the image is a full URL (Cloudinary) or just a filename
          return img.startsWith('http') ? 
            img : 
            `https://natours-yslc.onrender.com/img/tours/${img}`;
        });
        setImagesPreviews(previews);
      }
      
      setFormData(formattedTour);
    }
  }, [tour]);
  
  // Fetch available guides
  useEffect(() => {
    if (withGuides) {
      const fetchGuides = async () => {
        setIsLoadingGuides(true);
        try {
          const guides = await getAllGuides();
          setAvailableGuides(guides);
          setFilteredGuides(guides);
        } catch (error) {
          console.error('Error fetching guides:', error);
        } finally {
          setIsLoadingGuides(false);
        }
      };
      
      fetchGuides();
    }
  }, [withGuides]);
  
  // Filter guides when search term changes
  useEffect(() => {
    if (searchGuidesTerm.trim() === '') {
      setFilteredGuides(availableGuides);
    } else {
      const lowercasedSearch = searchGuidesTerm.toLowerCase();
      setFilteredGuides(
        availableGuides.filter(
          guide => guide.name.toLowerCase().includes(lowercasedSearch) ||
                  guide.email.toLowerCase().includes(lowercasedSearch) ||
                  guide.role.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchGuidesTerm, availableGuides]);
  
  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      // Handle regular properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? checked 
          : type === 'number'
            ? parseFloat(value)
            : value
      }));
    }
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle start date changes
  const handleStartDateChange = (index, value) => {
    const newDates = [...formData.startDates];
    newDates[index] = value;
    
    setFormData(prev => ({
      ...prev,
      startDates: newDates
    }));
  };
  
  // Add a new start date
  const addStartDate = () => {
    setFormData(prev => ({
      ...prev,
      startDates: [...prev.startDates, '']
    }));
  };
  
  // Remove a start date
  const removeStartDate = (index) => {
    const newDates = [...formData.startDates];
    newDates.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      startDates: newDates.length > 0 ? newDates : ['']
    }));
  };
  
  // Handle location changes
  const handleLocationChange = (index, field, value) => {
    const newLocations = [...formData.locations];
    
    if (field === 'coordinates') {
      // Handle coordinate changes
      const [coordIndex, coordValue] = value;
      newLocations[index].coordinates[coordIndex] = parseFloat(coordValue);
    } else {
      // Handle other fields
      newLocations[index][field] = field === 'day' ? parseInt(value, 10) : value;
    }
    
    setFormData(prev => ({
      ...prev,
      locations: newLocations
    }));
  };
  
  // Add a new location
  const addLocation = () => {
    const lastLocation = formData.locations[formData.locations.length - 1];
    const newDay = lastLocation ? lastLocation.day + 1 : 1;
    
    setFormData(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          type: 'Point',
          description: '',
          day: newDay,
          coordinates: [0, 0]
        }
      ]
    }));
  };
  
  // Remove a location
  const removeLocation = (index) => {
    const newLocations = [...formData.locations];
    newLocations.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      locations: newLocations.length > 0 ? newLocations : [
        {
          type: 'Point',
          description: '',
          day: 1,
          coordinates: [0, 0]
        }
      ]
    }));
  };
  
  // Handle start location changes
  const handleStartLocationChange = (field, value) => {
    if (field === 'coordinates') {
      // Handle coordinate changes
      const [coordIndex, coordValue] = value;
      setFormData(prev => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          coordinates: prev.startLocation.coordinates.map((coord, i) => 
            i === coordIndex ? parseFloat(coordValue) : coord
          )
        }
      }));
    } else {
      // Handle other fields
      setFormData(prev => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          [field]: value
        }
      }));
    }
  };
  
  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      imageCover: file
    }));
  };
  
  // Handle tour images upload
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Create previews
    const newPreviews = files.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(newPreviews).then(previewURLs => {
      setImagesPreviews(prev => [...prev, ...previewURLs]);
    });
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };
  
  // Remove an image
  const removeImage = (index) => {
    const newPreviews = [...imagesPreviews];
    newPreviews.splice(index, 1);
    setImagesPreviews(newPreviews);
    
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages
      };
    });
  };
  
  // Handle guide selection
  const handleGuideSelection = (guide) => {
    setFormData(prev => {
      // Check if guide is already selected
      const isAlreadySelected = prev.guides.some(g => g === guide._id);
      
      if (isAlreadySelected) {
        // Remove guide
        return {
          ...prev,
          guides: prev.guides.filter(g => g !== guide._id)
        };
      } else {
        // Add guide
        return {
          ...prev,
          guides: [...prev.guides, guide._id]
        };
      }
    });
  };
  
  // Check if a guide is selected
  const isGuideSelected = (guideId) => {
    return formData.guides.includes(guideId);
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Basic info validation
    if (!formData.name.trim()) {
      errors.name = 'Tour name is required';
    }
    
    if (!formData.duration || formData.duration < 1) {
      errors.duration = 'Tour must have a valid duration';
    }
    
    if (!formData.maxGroupSize || formData.maxGroupSize < 1) {
      errors.maxGroupSize = 'Tour must specify a group size';
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Tour must have a valid price';
    }
    
    // Content validation
    if (!formData.summary.trim()) {
      errors.summary = 'Tour summary is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Tour description is required';
    }
    
    // Start location validation
    if (!formData.startLocation.description.trim()) {
      errors['startLocation.description'] = 'Start location description is required';
    }
    
    // Guide validation
    if (withGuides && formData.guides.length === 0) {
      errors.guides = 'Please select at least one guide for the tour';
    }
    
    // Image validation for new tours
    if (!isEditMode && !formData.imageCover) {
      errors.imageCover = 'Cover image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create a copy of form data for submission
    const submissionData = { ...formData };
    
    // Handle priceDiscount validation issue when editing a tour
    if (isEditMode && submissionData.priceDiscount === 0) {
      // Remove priceDiscount entirely when it's 0 to avoid validation
      delete submissionData.priceDiscount;
    }
    
    // Prepare data for API
    // For a real implementation, you would handle file uploads differently
    // typically using FormData with multipart/form-data
    onSubmit(submissionData);
  };
  
  // Utility function to get field class based on validation state
  const getFieldClass = (fieldName) => {
    const baseClass = `w-full rounded-lg py-2 px-4 transition-colors focus:outline-none focus:ring-2 ${
      isDark 
        ? 'bg-gray-700 border-gray-600 text-white focus:ring-emerald-500 focus:border-emerald-500' 
        : 'bg-white border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500'
    }`;
    
    return validationErrors[fieldName]
      ? `${baseClass} ${isDark ? 'border-red-500' : 'border-red-500'}`
      : `${baseClass} ${isDark ? 'border-gray-600' : 'border-gray-300'}`;
  };
  
  // Utility function to get tab button class
  const getTabClass = (tabName) => {
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? isDark
          ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        : isDark
          ? 'text-gray-300 hover:bg-gray-700/50'
          : 'text-gray-700 hover:bg-gray-100'
    }`;
  };
  
  return (
    <div className="space-y-6">
      {/* Form title */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Tour' : 'Create New Tour'}
        </h2>
      </div>
      
      {/* Error display */}
      {error && (
        <div className={`p-4 rounded-lg flex items-start ${
          isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
        }`}>
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      {/* Form tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 md:gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          type="button"
          className={getTabClass('basic')}
          onClick={() => setActiveTab('basic')}
        >
          <div className="flex items-center">
            <Info size={16} className="mr-2" />
            Basic Info
          </div>
        </button>
        <button
          type="button"
          className={getTabClass('content')}
          onClick={() => setActiveTab('content')}
        >
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Content
          </div>
        </button>
        <button
          type="button"
          className={getTabClass('dates')}
          onClick={() => setActiveTab('dates')}
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            Dates
          </div>
        </button>
        <button
          type="button"
          className={getTabClass('locations')}
          onClick={() => setActiveTab('locations')}
        >
          <div className="flex items-center">
            <Map size={16} className="mr-2" />
            Locations
          </div>
        </button>
        <button
          type="button"
          className={getTabClass('images')}
          onClick={() => setActiveTab('images')}
        >
          <div className="flex items-center">
            <ImageIcon size={16} className="mr-2" />
            Images
          </div>
        </button>
        {withGuides && (
          <button
            type="button"
            className={getTabClass('guides')}
            onClick={() => setActiveTab('guides')}
          >
            <div className="flex items-center">
              <UsersIcon size={16} className="mr-2" />
              Guides
            </div>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        {activeTab === 'basic' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Tour Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tour Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 ${getFieldClass('name')}`}
                  placeholder="e.g. The Forest Explorer"
                />
              </div>
              {validationErrors.name && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>
            
            {/* Tour Duration */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (days)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration ?? 1}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 ${getFieldClass('duration')}`}
                />
              </div>
              {validationErrors.duration && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.duration}
                </p>
              )}
            </div>
            
            {/* Max Group Size */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Group Size
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize ?? 10}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 ${getFieldClass('maxGroupSize')}`}
                />
              </div>
              {validationErrors.maxGroupSize && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.maxGroupSize}
                </p>
              )}
            </div>
            
            {/* Difficulty */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`pl-10 ${getFieldClass('difficulty')}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
              {validationErrors.difficulty && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.difficulty}
                </p>
              )}
            </div>
            
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price ?? 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`pl-10 ${getFieldClass('price')}`}
                />
              </div>
              {validationErrors.price && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.price}
                </p>
              )}
            </div>
            
            {/* Price Discount */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Discount (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="number"
                  name="priceDiscount"
                  value={formData.priceDiscount ?? 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`pl-10 ${getFieldClass('priceDiscount')}`}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Content Section */}
        {activeTab === 'content' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Summary */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Summary
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className={getFieldClass('summary')}
                  placeholder="Brief summary of the tour"
                />
              </div>
              {validationErrors.summary && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.summary}
                </p>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={getFieldClass('description')}
                  placeholder="Detailed description of the tour"
                ></textarea>
              </div>
              {validationErrors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Dates Section */}
        {activeTab === 'dates' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tour Start Dates</h3>
              <button
                type="button"
                onClick={addStartDate}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-700 text-emerald-400 hover:bg-gray-600' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                } transition-colors`}
              >
                <Plus size={18} />
              </button>
            </div>
            
            {formData.startDates.map((date, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-grow space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleStartDateChange(index, e.target.value)}
                      className={`pl-10 ${getFieldClass(`startDates.${index}`)}`}
                    />
                  </div>
                </div>
                {formData.startDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStartDate(index)}
                    className={`p-2 rounded-full ${
                      isDark 
                        ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } transition-colors`}
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Locations Section */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Start Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Start Location</h3>
              
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.startLocation.description}
                    onChange={(e) => handleStartLocationChange('description', e.target.value)}
                    className={getFieldClass('startLocation.description')}
                    placeholder="e.g. Miami, USA"
                  />
                  {validationErrors['startLocation.description'] && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {validationErrors['startLocation.description']}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.startLocation.address}
                    onChange={(e) => handleStartLocationChange('address', e.target.value)}
                    className={getFieldClass('startLocation.address')}
                    placeholder="e.g. 301 Biscayne Blvd, Miami, FL 33132"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Latitude
                    </label>
                    <input
                      type="number"
                      value={formData.startLocation?.coordinates?.[1] ?? 0}
                      onChange={(e) => handleStartLocationChange('coordinates', [1, e.target.value])}
                      step="0.000001"
                      className={getFieldClass('startLocation.coordinates.1')}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Longitude
                    </label>
                    <input
                      type="number"
                      value={formData.startLocation?.coordinates?.[0] ?? 0}
                      onChange={(e) => handleStartLocationChange('coordinates', [0, e.target.value])}
                      step="0.000001"
                      className={getFieldClass('startLocation.coordinates.0')}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tour Locations/Stops */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tour Stops</h3>
                <button
                  type="button"
                  onClick={addLocation}
                  className={`p-2 rounded-full ${
                    isDark 
                      ? 'bg-gray-700 text-emerald-400 hover:bg-gray-600' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  } transition-colors`}
                >
                  <Plus size={18} />
                </button>
              </div>
              
              {formData.locations.map((location, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Stop {index + 1}
                    </h4>
                    
                    {formData.locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className={`p-1.5 rounded-full ${
                          isDark 
                            ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        } transition-colors`}
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <input
                      type="text"
                      value={location.description}
                      onChange={(e) => handleLocationChange(index, 'description', e.target.value)}
                      className={getFieldClass(`locations.${index}.description`)}
                      placeholder="e.g. Statue of Liberty"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Day
                    </label>
                    <input
                      type="number"
                      value={location.day}
                      onChange={(e) => handleLocationChange(index, 'day', e.target.value)}
                      min="1"
                      className={getFieldClass(`locations.${index}.day`)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Latitude
                      </label>
                      <input
                        type="number"
                        value={location?.coordinates?.[1] ?? 0}
                        onChange={(e) => handleLocationChange(index, 'coordinates', [1, e.target.value])}
                        step="0.000001"
                        className={getFieldClass(`locations.${index}.coordinates.1`)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Longitude
                      </label>
                      <input
                        type="number"
                        value={location?.coordinates?.[0] ?? 0}
                        onChange={(e) => handleLocationChange(index, 'coordinates', [0, e.target.value])}
                        step="0.000001"
                        className={getFieldClass(`locations.${index}.coordinates.0`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Images Section */}
        {activeTab === 'images' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDark
                    ? 'border-gray-600 hover:border-emerald-500 bg-gray-700/50 hover:bg-gray-700'
                    : 'border-gray-300 hover:border-emerald-500 bg-gray-50 hover:bg-gray-100'
                } ${validationErrors.imageCover ? 'border-red-500' : ''}`}
                onClick={() => fileInputRef.current.click()}
              >
                {coverImagePreview ? (
                  <div className="relative">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover Preview" 
                      className="max-h-64 mx-auto rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImagePreview(null);
                        setFormData(prev => ({ ...prev, imageCover: null }));
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Click to upload a cover image
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </div>
              
              {validationErrors.imageCover && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.imageCover}
                </p>
              )}
            </div>
            
            {/* Tour Images */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tour Images
                </label>
                
                <label 
                  className={`inline-flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-emerald-400 hover:bg-gray-600'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Images</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                  />
                </label>
              </div>
              
              {imagesPreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Tour Image ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDark
                    ? 'border-gray-600 bg-gray-700/50'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No tour images added yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Guides Section */}
        {withGuides && (
          <>
            <GuidesSection 
              activeTab={activeTab}
              formData={formData}
              handleGuideSelection={handleGuideSelection}
              availableGuides={availableGuides}
              isLoadingGuides={isLoadingGuides}
              isDark={isDark}
            />
            
            {validationErrors.guides && activeTab === 'guides' && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {validationErrors.guides}
              </p>
            )}
          </>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center min-w-[120px]`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                {isEditMode ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                {isEditMode ? 'Save Tour' : 'Create Tour'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TourForm;