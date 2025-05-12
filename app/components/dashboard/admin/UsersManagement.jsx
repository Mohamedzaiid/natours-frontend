'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw,
  Shield,
  UserCheck,
  UserX,
  HelpCircle,
  Loader,
  AlertCircle,
  Check
} from 'lucide-react';
// Import resource hook instead of direct API calls
import { useUsers } from '@/app/hooks/data/useResourceData';
import UserForm from './forms/UserForm';
import Card from '@/app/components/dashboard/Card';
import DataTable from '@/app/components/dashboard/DataTable';

const UsersManagement = () => {
  // Use the resource hook for users management
  const { 
    users, 
    loading: isLoading, 
    error, 
    fetchUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    invalidateUsers
  } = useUsers({ autoFetch: true });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Define user table columns
  const userColumns = [
    {
      id: 'photo',
      header: '',
      accessor: (user) => user.photo,
      cell: (user) => (
        <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {user.photo && user.photo !== 'default.jpg' ? (
            <img
              src={`https://natours-yslc.onrender.com/img/users/${user.photo}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
        </div>
      ),
      width: '60px'
    },
    {
      id: 'name',
      header: 'Name',
      accessor: (user) => user.name,
      sortable: true,
      searchable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (user) => user.email,
      sortable: true,
      searchable: true
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (user) => user.role,
      sortable: true,
      searchable: true,
      cell: (user, { isDark } = {}) => (
        <div className="flex items-center">
          {user.role === 'admin' ? (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-200 text-purple-800 border border-purple-300'}`}>
              <Shield size={12} className="mr-1" /> Admin
            </span>
          ) : user.role === 'lead-guide' ? (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-200 text-blue-800 border border-blue-300'}`}>
              <UserCheck size={12} className="mr-1" /> Lead Guide
            </span>
          ) : user.role === 'guide' ? (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-200 text-green-800 border border-green-300'}`}>
              <UserCheck size={12} className="mr-1" /> Guide
            </span>
          ) : (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800 border border-gray-300'}`}>
              <User size={12} className="mr-1" /> User
            </span>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (user) => user.active,
      sortable: true,
      cell: (user, { isDark } = {}) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.active !== false
            ? isDark 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-green-200 text-green-800 border border-green-300'
            : isDark 
              ? 'bg-red-900/30 text-red-300' 
              : 'bg-red-200 text-red-800 border border-red-300'
        }`}>
          {user.active !== false ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(user)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];
  
  // Update filtered users when search term or users change
  useEffect(() => {
    if (!users) return;
    
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          user => 
            user.name.toLowerCase().includes(lowercasedSearch) || 
            user.email.toLowerCase().includes(lowercasedSearch) ||
            user.role.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, users]);
  
  // Function to handle edit user click
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsCreatingUser(false);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle create user click
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreatingUser(true);
    setFormError(null);
    setIsModalOpen(true);
  };
  
  // Function to handle form submission (for both edit and create)
  const handleFormSubmit = async (userData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (isCreatingUser) {
        // Create a new user
        await createUser(userData);
        setSuccessMessage(`User ${userData.name} created successfully`);
      } else {
        // Update an existing user
        await updateUser(selectedUser._id, userData);
        setSuccessMessage(`User ${userData.name} updated successfully`);
      }
      
      // Close the modal
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isCreatingUser ? 'creating' : 'updating'} user:`, err);
      setFormError(err.message || `Failed to ${isCreatingUser ? 'create' : 'update'} user`);
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
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Function to handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setFormLoading(true);
      await deleteUser(selectedUser._id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setSuccessMessage(`User ${selectedUser.name} deleted successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setFormError(err.message || 'Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Function to handle refresh click
  const handleRefreshUsers = () => {
    fetchUsers(true); // Force refresh
  };
  
  // Render the component
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={handleRefreshUsers}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Refresh users"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreateUser}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus size={16} className="mr-2" />
            Add User
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error loading users</h3>
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
      
      {/* Users Table */}
      <Card>
        {isLoading && !users ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users && filteredUsers.length > 0 ? (
          <DataTable
            columns={userColumns}
            data={filteredUsers}
            showSearch={false}
            pagination={true}
            pageSize={10}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <HelpCircle size={40} className="text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No users match your search criteria' : 'No users found'}
            </p>
          </div>
        )}
      </Card>
      
      {/* User Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <UserForm
              user={isCreatingUser ? null : selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              isLoading={formLoading}
              error={formError}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the user <span className="font-semibold">{selectedUser.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
