'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useTheme } from '@/app/providers/theme/ThemeProvider';
import { RefreshCw } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Customized,
  Dot,
  defs
} from 'recharts';

export const LineChart = ({ 
  data, 
  category, 
  value,
  colors = {
    gradient: {
      from: '#10b981',
      to: 'rgba(16, 185, 129, 0.05)'
    },
    line: '#10b981',
    point: '#047857'
  },
  height = 200,
  showPoints = true,
  showLabels = true,
  showGrid = true,
  title = '',
  className = ''
}) => {
  const { isDark } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [mountState, setMountState] = useState('mounting'); // 'mounting', 'ready', 'animated'
  const containerRef = useRef(null);
  
  // Stage 1: Initial component mount setup
  useEffect(() => {
    // Mark component as ready for animation after a short delay
    // to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      setMountState('ready');
    }, 500);
    
    return () => {
      clearTimeout(timer);
      setMountState('mounting');
    };
  }, []);
  
  // Stage 2: Start animation sequence when component is ready
  useEffect(() => {
    if (mountState === 'ready' && data && data.length > 0) {
      // Start animation sequence
      setIsRefreshing(true);
      setAnimationKey(key => key + 1);
      
      // Wait before injecting data to ensure animation is visible
      const dataTimer = setTimeout(() => {
        console.log('Setting chart data - animation should be visible now');
        setChartData([]);
        
        // Additional delay before populating with real data
        setTimeout(() => {
          setChartData(data);
          
          // Mark as animated after animation completes
          setTimeout(() => {
            setIsRefreshing(false);
            setMountState('animated');
          }, 4000); // Allow enough time for animation to complete
        }, 800);
      }, 200);
      
      return () => clearTimeout(dataTimer);
    }
  }, [mountState, data]);
  
  // Refresh chart with animation (manual trigger)
  const refreshChart = () => {
    setIsRefreshing(true);
    setChartData([]); // Clear the chart
    setAnimationKey(prevKey => prevKey + 1); // Force re-render
    
    // Delayed data setting with clear visuals
    setTimeout(() => {
      // Additional delay before populating with real data
      setTimeout(() => {
        setChartData(data);
        
        // Reset state after animation
        setTimeout(() => {
          setIsRefreshing(false);
        }, 4000);
      }, 800);
    }, 200);
  };
  
  // Define theme-specific colors
  const themeColors = {
    text: isDark ? '#e5e7eb' : '#374151',
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tooltip: {
      bg: isDark ? '#374151' : '#ffffff',
      text: isDark ? '#e5e7eb' : '#374151',
      border: isDark ? '#4b5563' : '#e5e7eb'
    }
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 shadow-lg rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Show loading state during initial mount
  if (mountState === 'mounting') {
    return (
      <div style={{ height: `${height}px` }} className="flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-center">
          <RefreshCw size={24} className="mx-auto text-gray-400 dark:text-gray-600 animate-spin mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading chart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">{title}</h3>
          <button 
            onClick={refreshChart}
            className={`flex items-center text-xs font-medium px-3 py-1.5 rounded-full ${
              isRefreshing 
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={`mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Animating...' : 'Refresh Chart'}
          </button>
        </div>
      )}
      
      <div 
        style={{ height: `${height}px` }} 
        className={`relative rounded-lg overflow-hidden ${
          isRefreshing 
            ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-gray-50/30 dark:before:via-gray-700/40 before:to-transparent before:animate-pulse before:z-10' 
            : ''
        }`}
      >
        {/* Show loading state during animation preparation */}
        {(chartData.length === 0 && isRefreshing) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80 z-20 rounded-lg">
            <div className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-2">
                <div className="absolute inset-0 border-t-4 border-b-4 border-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-4 border-l-4 border-blue-500 rounded-full animate-spin animation-delay-500"></div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Preparing visualization...</p>
            </div>
          </div>
        )}
        
        {/* Show chart once data is available */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" key={animationKey}>
            <RechartsLineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              animationDuration={3000}
              animationEasing="ease-out"
              animationBegin={0}
            >
              {/* Add gradient for the chart */}
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.line} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colors.line} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              
              {/* Add area under the line with gradient */}
              <Area 
                type="monotone"
                dataKey={value}
                stroke="none"
                fillOpacity={1}
                fill="url(#colorGradient)"
                animationDuration={3500}
                animationEasing="ease-in-out"
                isAnimationActive={true}
              />
              
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={themeColors.grid}
                  vertical={false}
                />
              )}
              
              <XAxis
                dataKey={category}
                tick={{ fill: themeColors.text, fontSize: 12 }}
                tickLine={{ stroke: themeColors.grid }}
                axisLine={{ stroke: themeColors.grid }}
              />
              
              <YAxis 
                tick={{ fill: themeColors.text, fontSize: 12 }}
                tickLine={{ stroke: themeColors.grid }}
                axisLine={{ stroke: themeColors.grid }}
                tickFormatter={(val) => val.toLocaleString()}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey={value}
                name={title}
                stroke={colors.line}
                strokeWidth={3}
                dot={showPoints ? { 
                  fill: colors.point, 
                  stroke: colors.line, 
                  strokeWidth: 2, 
                  r: 5,
                  className: "animate-pulse"
                } : false}
                activeDot={{ 
                  fill: colors.point, 
                  stroke: colors.line, 
                  strokeWidth: 2, 
                  r: 7,
                  className: "animate-ping" 
                }}
                animationDuration={3500}
                animationEasing="cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Set to ease-out-quad for more dramatic effect
                animationBegin={0}
                isAnimationActive={true}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="text-center">
              <RefreshCw size={24} className="mx-auto text-gray-400 dark:text-gray-600 mb-2 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isRefreshing ? "Preparing chart..." : "No data available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default LineChart;
