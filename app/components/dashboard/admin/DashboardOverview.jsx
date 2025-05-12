'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Map, 
  Calendar, 
  DollarSign, 
  Star, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader,
  UserCheck,
  Briefcase
} from 'lucide-react';
// Use the resource data hooks instead of direct API calls
import { useDashboardStats } from '@/app/hooks/data/useResourceData';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import Card from '@/app/components/dashboard/Card';
import StatsCard from '@/app/components/dashboard/StatsCard';
import LineChart from '@/app/components/dashboard/LineChart';
import DataTable from '@/app/components/dashboard/DataTable';

const DashboardOverview = ({ onTabChange }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  
  // Use the dashboard stats hook instead of manual state management
  const { stats, loading: isLoading, error, fetchStats, invalidateStats } = useDashboardStats({
    autoFetch: true,
    refreshInterval: 300000 // Refresh every 5 minutes
  });
  
  // Define table columns for recent users
  const userColumns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (user) => user.name,
      sortable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (user) => user.email,
      sortable: true
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (user) => user.role,
      sortable: true,
      cell: (user, { isDark } = {}) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'admin'
            ? isDark 
              ? 'bg-purple-900/30 text-purple-300' 
              : 'bg-purple-200 text-purple-800 border border-purple-300'
            : user.role === 'lead-guide' || user.role === 'guide'
              ? isDark 
                ? 'bg-blue-900/30 text-blue-300' 
                : 'bg-blue-200 text-blue-800 border border-blue-300'
              : isDark 
                ? 'bg-green-900/30 text-green-300' 
                : 'bg-green-200 text-green-800 border border-green-300'
        }`}>
          {user.role}
        </span>
      )
    },
    {
      id: 'joined',
      header: 'Joined',
      accessor: (user) => user.joined,
      sortable: true,
      cell: (user) => new Date(user.joined).toLocaleDateString()
    }
  ];
  
  // Define table columns for recent bookings
  const bookingColumns = [
    {
      id: 'tour',
      header: 'Tour',
      accessor: (booking) => booking.tour,
      sortable: true
    },
    {
      id: 'user',
      header: 'User',
      accessor: (booking) => booking.user,
      sortable: true
    },
    {
      id: 'date',
      header: 'Date',
      accessor: (booking) => booking.date,
      sortable: true,
      cell: (booking) => new Date(booking.date).toLocaleDateString()
    },
    {
      id: 'price',
      header: 'Price',
      accessor: (booking) => booking.price,
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (booking) => booking.paid,
      sortable: true,
      cell: (booking, { isDark } = {}) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          booking.status === 'Paid'
            ? isDark 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-green-200 text-green-800 border border-green-300'
            : booking.status === 'Pending'
              ? isDark 
                ? 'bg-yellow-900/30 text-yellow-300' 
                : 'bg-yellow-200 text-yellow-800 border border-yellow-300'
              : isDark 
                ? 'bg-red-900/30 text-red-300' 
                : 'bg-red-200 text-red-800 border border-red-300'
        }`}>
          {booking.status}
        </span>
      )
    }
  ];
  
  // For debugging - show stats data in dev console
  useEffect(() => {
    if (stats) {
      console.log('Dashboard stats loaded:', stats);
    }
  }, [stats]);
  
  // Use real data if available, or fallback to empty arrays/objects
  const dashboardData = stats || {
    counts: {
      users: 0,
      tours: 0,
      bookings: 0,
      reviews: 0
    },
    revenue: {
      total: 0,
      trend: 0
    },
    recentUsers: [],
    recentBookings: [],
    topTours: []
  };
  
  // Process data for charts
  const chartData = useMemo(() => {
    // Helper function to get month from date string
    const getMonthFromDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { month: 'short' });
    };

    // Helper function to get last 6 months in order
    const getLast6Months = () => {
      const months = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          month: d.toLocaleString('en-US', { month: 'short' }),
          users: 0,
          revenue: 0
        });
      }
      return months;
    };

    // Start with empty data for the last 6 months
    const monthlyData = getLast6Months();
    const monthsMap = monthlyData.reduce((acc, item) => {
      acc[item.month] = { users: 0, revenue: 0 };
      return acc;
    }, {});

    // Process user data if available
    if (dashboardData.recentUsers && dashboardData.recentUsers.length > 0) {
      dashboardData.recentUsers.forEach(user => {
        if (user.joined) {
          const month = getMonthFromDate(user.joined);
          if (monthsMap[month]) {
            monthsMap[month].users += 1;
          }
        }
      });
    }

    // Process booking data if available
    if (dashboardData.recentBookings && dashboardData.recentBookings.length > 0) {
      dashboardData.recentBookings.forEach(booking => {
        if (booking.date && booking.price) {
          const month = getMonthFromDate(booking.date);
          if (monthsMap[month]) {
            monthsMap[month].revenue += Number(booking.price);
          }
        }
      });
    }

    // Update monthly data with processed values
    monthlyData.forEach(item => {
      if (monthsMap[item.month]) {
        item.users = monthsMap[item.month].users;
        item.revenue = monthsMap[item.month].revenue;
      }
    });

    return monthlyData;
  }, [dashboardData.recentUsers, dashboardData.recentBookings]);
  
  // Calculate trend percentages
  const calculateTrend = useMemo(() => {
    // If no real data available, return default values
    if (!stats) {
      return {
        users: { change: 0, trend: 'up' },
        tours: { change: 0, trend: 'up' },
        bookings: { change: 0, trend: 'up' },
        revenue: { change: 0, trend: 'up' }
      };
    }

    // Helper to calculate percentage change between last two months
    const getPercentageChange = (key) => {
      if (chartData.length < 2) return { change: 0, trend: 'up' };
      
      const currentMonth = chartData[chartData.length - 1][key] || 0;
      const prevMonth = chartData[chartData.length - 2][key] || 0;
      
      // Avoid division by zero
      if (prevMonth === 0) {
        return { 
          change: currentMonth > 0 ? 100 : 0, 
          trend: currentMonth > 0 ? 'up' : 'flat' 
        };
      }
      
      const change = Math.round(((currentMonth - prevMonth) / prevMonth) * 100);
      return {
        change: Math.abs(change),
        trend: change >= 0 ? 'up' : 'down'
      };
    };

    return {
      users: getPercentageChange('users'),
      revenue: getPercentageChange('revenue'),
      // For tours and bookings, use a placeholder calculation since we don't track monthly data
      // This could be improved if the API provides historical counts
      tours: { 
        change: Math.abs(dashboardData.revenue.trend || 0), 
        trend: (dashboardData.revenue.trend || 0) >= 0 ? 'up' : 'down' 
      },
      bookings: { 
        change: Math.abs(dashboardData.revenue.trend || 0), 
        trend: (dashboardData.revenue.trend || 0) >= 0 ? 'up' : 'down' 
      }
    };
  }, [stats, chartData, dashboardData.revenue.trend]);
  
  // Render loading state
  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard statistics...</p>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-6 rounded-lg flex items-start">
        <AlertCircle size={24} className="mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold">Error loading dashboard data</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchStats(true)} // Force refresh
            className="mt-3 flex items-center px-4 py-2 bg-red-700 dark:bg-red-600 text-white rounded-md hover:bg-red-800 dark:hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users"
          value={dashboardData.counts.users || 0}
          icon={<Users size={24} />}
          change={calculateTrend.users.change}
          trend={calculateTrend.users.trend}
          color="blue"
        />

        <StatsCard 
          title="Total Tours"
          value={dashboardData.counts.tours || 0}
          icon={<Map size={24} />}
          change={calculateTrend.tours.change}
          trend={calculateTrend.tours.trend}
          color="green"
        />

        <StatsCard 
          title="Total Bookings"
          value={dashboardData.counts.bookings || 0}
          icon={<Calendar size={24} />}
          change={calculateTrend.bookings.change}
          trend={calculateTrend.bookings.trend}
          color="yellow"
        />

        <StatsCard 
          title="Total Revenue"
          value={`$${dashboardData.revenue.total || 0}`}
          icon={<DollarSign size={24} />}
          change={calculateTrend.revenue.change}
          trend={calculateTrend.revenue.trend}
          color="purple"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <Card 
          title="User Growth" 
          description="Monthly new user registrations"
          className="transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="h-72 mb-3">
            <LineChart 
              data={chartData}
              category="month"
              value="users"
              height={288}
              title="New Users"
              key={`users-chart-${chartData.length}`}
              colors={{
                gradient: {
                  from: '#3b82f6',
                  to: 'rgba(59, 130, 246, 0.05)'
                },
                line: '#3b82f6',
                point: '#1d4ed8'
              }}
            />
          </div>
        </Card>

        <Card 
          title="Revenue Trend" 
          description="Monthly revenue statistics"
          className="transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="h-72 ">
            <LineChart 
              data={chartData}
              category="month"
              value="revenue"
              height={288}
              title="Revenue ($)"
              key={`revenue-chart-${chartData.length}`}
              colors={{
                gradient: {
                  from: '#8b5cf6',
                  to: 'rgba(139, 92, 246, 0.05)'
                },
                line: '#8b5cf6',
                point: '#6d28d9'
              }}
            />
          </div>
        </Card>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <DataTable 
          title="Recent Users"
          description="New users that have joined recently"
          columns={userColumns}
          data={dashboardData.recentUsers || []}
          actionText="View All Users"
          onActionClick={() => onTabChange('users')}
          showSearch={false}
          pagination={true}
          pageSize={5}
        />

        {/* Recent Bookings */}
        <DataTable 
          title="Recent Bookings"
          description="Latest tour bookings"
          columns={bookingColumns}
          data={dashboardData.recentBookings || []}
          actionText="View All Bookings"
          onActionClick={() => onTabChange('bookings')}
          showSearch={false}
          pagination={true}
          pageSize={5}
        />
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onTabChange('users')}
            className={`flex flex-col items-center p-4 rounded-lg border ${isDark ? 'border-gray-700 hover:bg-gray-800/70' : 'border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'} transition-all duration-200`}
          >
            <Users size={24} className="text-blue-600 dark:text-blue-400 mb-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</span>
          </button>
          <button 
            onClick={() => onTabChange('tours')}
            className={`flex flex-col items-center p-4 rounded-lg border ${isDark ? 'border-gray-700 hover:bg-gray-800/70' : 'border-gray-200 hover:bg-green-50 hover:border-green-200 hover:shadow-md'} transition-all duration-200`}
          >
            <Map size={24} className="text-green-600 dark:text-green-400 mb-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Tours</span>
          </button>
          <button 
            onClick={() => onTabChange('bookings')}
            className={`flex flex-col items-center p-4 rounded-lg border ${isDark ? 'border-gray-700 hover:bg-gray-800/70' : 'border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:shadow-md'} transition-all duration-200`}
          >
            <Briefcase size={24} className="text-amber-600 dark:text-amber-400 mb-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Bookings</span>
          </button>
          <button 
            onClick={() => onTabChange('reviews')}
            className={`flex flex-col items-center p-4 rounded-lg border ${isDark ? 'border-gray-700 hover:bg-gray-800/70' : 'border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:shadow-md'} transition-all duration-200`}
          >
            <Star size={24} className="text-purple-600 dark:text-purple-400 mb-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Reviews</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
