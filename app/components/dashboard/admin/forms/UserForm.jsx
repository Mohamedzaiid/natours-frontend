'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Check, 
  X, 
  AlertCircle,
  Loader
} from 'lucide-react';

const UserForm = ({ 
  user = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  error = null
}) => {
  const { isDark } = useTheme();
  const isEditMode = !!user;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
    active: true
  });
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  
  // Initialize form with user data if in edit mode
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        passwordConfirm: '',
        role: user.role || 'user',
        active: user.active !== false, // Handle undefined case
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation (required for new users, optional for edits)
    if (!isEditMode && !formData.password) {
      errors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password && formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
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
    
    // Create data object for API
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      active: formData.active
    };
    
    // Only include password fields if they are provided
    if (formData.password) {
      userData.password = formData.password;
      userData.passwordConfirm = formData.passwordConfirm;
    }
    
    onSubmit(userData);
  };
  
  // Get field class based on validation state
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {isEditMode ? 'Edit User' : 'Add New User'}
      </h2>
      
      {/* Error display */}
      {error && (
        <div className={`p-4 rounded-lg flex items-start ${
          isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
        }`}>
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      {/* Name field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`pl-10 ${getFieldClass('name')}`}
            placeholder="Full Name"
          />
        </div>
        {validationErrors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {validationErrors.name}
          </p>
        )}
      </div>
      
      {/* Email field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 ${getFieldClass('email')}`}
            placeholder="Email Address"
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {validationErrors.email}
          </p>
        )}
      </div>
      
      {/* Password field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 ${getFieldClass('password')}`}
            placeholder={isEditMode ? '••••••••' : 'New Password'}
          />
        </div>
        {validationErrors.password && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {validationErrors.password}
          </p>
        )}
      </div>
      
      {/* Password Confirm field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className={`pl-10 ${getFieldClass('passwordConfirm')}`}
            placeholder="Confirm Password"
          />
        </div>
        {validationErrors.passwordConfirm && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {validationErrors.passwordConfirm}
          </p>
        )}
      </div>
      
      {/* Role selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Shield size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`pl-10 ${getFieldClass('role')}`}
          >
            <option value="user">User</option>
            <option value="guide">Guide</option>
            <option value="lead-guide">Lead Guide</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      
      {/* Active status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          checked={formData.active}
          onChange={handleChange}
          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-emerald-500"
        />
        <label 
          htmlFor="active" 
          className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Active Account
        </label>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end space-x-3 mt-6">
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
          className={`px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center min-w-[100px]`}
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
              {isEditMode ? 'Save Changes' : 'Create User'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;