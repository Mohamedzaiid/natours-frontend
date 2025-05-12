'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import Link from 'next/link';
import Image from 'next/image';

import { 
  DashboardOverview,
  UsersManagement,
  ToursManagement,
  BookingsManagement,
  ReviewsManagement
} from '@/app/components/dashboard/admin';

// Import the enhanced components
import StatsCard from '@/app/components/dashboard/StatsCard';
import DataTable from '@/app/components/dashboard/DataTable';
import Card from '@/app/components/dashboard/Card';
import SidebarSection from '@/app/components/dashboard/SidebarSection';
import LineChart from '@/app/components/dashboard/LineChart';

// Icon imports
import { 
  Users, 
  Home, 
  Calendar, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X,
  Star,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  User,
  Loader2,
  Layers,
  PieChart,
  Activity,
  CreditCard,
  Map,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user has proper permissions (admin or lead-guide)
  useEffect(() => {
    // Check if the user is authenticated and has admin privileges
    if (!loading && user) {
      if (user.role !== 'admin' && user.role !== 'lead-guide') {
        // Redirect to account page if not an admin or lead guide
        router.push('/account');
      }
    } else if (!loading && !user) {
      // Redirect to login page if not authenticated
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!loading && user && user.role !== 'admin' && user.role !== 'lead-guide') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <X size={40} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Link 
            href="/account" 
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  // Navigation items for the sidebar - with subsections
  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'overview', name: 'Overview', icon: <BarChart2 size={20} /> },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'users', name: 'Users', icon: <Users size={20} /> },
        { id: 'tours', name: 'Tours', icon: <Home size={20} /> },
        { id: 'bookings', name: 'Bookings', icon: <Calendar size={20} /> },
        { id: 'reviews', name: 'Reviews', icon: <Star size={20} /> },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
      ]
    }
  ];

  // Main dashboard
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen flex-col">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4 font-semibold text-lg text-gray-900 dark:text-white">Admin Dashboard</div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/account" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Back to Account
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 h-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 overflow-y-auto">
              <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-green-600">Natours</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Admin Dashboard
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="mt-5 px-2 space-y-6">
                {navSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </p>
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${activeTab === item.id ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700 border border-green-100' : isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={logout}
                className="group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50 dark:text-red-400"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className={`hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:z-10 ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        } transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg`}>
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              {sidebarOpen ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-green-600">Natours</span>
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Admin</span>
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <span className="text-xl font-bold text-green-600">N</span>
                </div>
              )}
            </div>
            
            <div className="flex-grow px-2">
              {navSections.map((section) => (
                <SidebarSection 
                  key={section.title} 
                  title={sidebarOpen ? section.title : null}
                  defaultOpen={true}
                  collapsible={sidebarOpen}
                >
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${activeTab === item.id ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700 border border-green-100' : isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                    >
                      <span className={sidebarOpen ? "mr-3" : "mx-auto"}>{item.icon}</span>
                      {sidebarOpen && item.name}
                    </button>
                  ))}
                </SidebarSection>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={logout}
                className={`group flex items-center text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50 dark:text-red-400 ${
                  sidebarOpen ? 'px-4 py-2' : 'justify-center py-2'
                }`}
              >
                <LogOut size={20} className={sidebarOpen ? "mr-3" : ""} />
                {sidebarOpen && 'Logout'}
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-10 bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                sidebarOpen ? 'rotate-90' : '-rotate-90'
              } text-gray-500`}
            />
          </button>
        </div>

        {/* Main content */}
        <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300 pt-16 lg:pt-0 min-h-screen`}>
          {/* Desktop header */}
          <div className={`hidden lg:flex lg:sticky lg:top-0 lg:z-20 lg:h-16 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-white to-gray-50'} lg:border-b lg:border-gray-200 lg:dark:border-gray-700 shadow-md transition-all duration-300`}>
            <div className="flex-1 flex justify-between items-center px-6 bg-transparent dark:bg-transparent">
              <div>
                <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} relative pb-2 after:absolute after:h-0.5 after:w-12 after:bottom-0 after:left-0 after:bg-green-500 after:rounded-full`}>
                  {navSections.flatMap(s => s.items).find(item => item.id === activeTab)?.name || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`pl-10 pr-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700/70 hover:bg-gray-700 focus:bg-gray-700 text-white' : 'border-gray-200 bg-white hover:bg-gray-50 focus:bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all duration-200`}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className={`p-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100'} rounded-full relative transition-all duration-200 shadow-sm`}>
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link href="/account" className={`flex items-center text-sm font-medium px-4 py-2 rounded-md ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600'} transition-colors shadow-sm`}>
                  <User size={20} className="mr-2" />
                  Back to Account
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <main className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <DashboardOverview onTabChange={setActiveTab} />
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <UsersManagement />
            )}

            {/* Tours Tab */}
            {activeTab === 'tours' && (
              <ToursManagement />
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <BookingsManagement />
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <ReviewsManagement />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Settings</h2>
                </div>
                <Card>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Settings functionality will be implemented in Phase 2.
                  </p>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
    </div>
  );
}
