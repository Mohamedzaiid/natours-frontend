'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '@/app/providers/theme/ThemeProvider';

export const StatsCard = ({ title, value, icon, change, trend, color }) => {
  const { isDark } = useTheme();
  
  // Define color schemes for different card types
  const colorSchemes = {
    blue: {
      iconBg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
      cardBg: isDark ? 'bg-gradient-to-br from-gray-800 to-blue-900/30' : 'bg-gradient-to-br from-white to-blue-50',
      trendUp: isDark ? 'text-emerald-400' : 'text-emerald-600',
      trendDown: isDark ? 'text-red-400' : 'text-red-600',
      borderColor: isDark ? 'border-l-blue-400' : 'border-l-blue-500'
    },
    green: {
      iconBg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      cardBg: isDark ? 'bg-gradient-to-br from-gray-800 to-emerald-900/30' : 'bg-gradient-to-br from-white to-emerald-50',
      trendUp: isDark ? 'text-emerald-400' : 'text-emerald-600',
      trendDown: isDark ? 'text-red-400' : 'text-red-600',
      borderColor: isDark ? 'border-l-emerald-400' : 'border-l-emerald-500'
    },
    yellow: {
      iconBg: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
      cardBg: isDark ? 'bg-gradient-to-br from-gray-800 to-amber-900/30' : 'bg-gradient-to-br from-white to-amber-50',
      trendUp: isDark ? 'text-emerald-400' : 'text-emerald-600',
      trendDown: isDark ? 'text-red-400' : 'text-red-600',
      borderColor: isDark ? 'border-l-amber-400' : 'border-l-yellow-500'
    },
    purple: {
      iconBg: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
      cardBg: isDark ? 'bg-gradient-to-br from-gray-800 to-purple-900/30' : 'bg-gradient-to-br from-white to-purple-50',
      trendUp: isDark ? 'text-emerald-400' : 'text-emerald-600',
      trendDown: isDark ? 'text-red-400' : 'text-red-600',
      borderColor: isDark ? 'border-l-purple-400' : 'border-l-purple-500'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;
  
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 border-l-4 ${scheme.borderColor} ${scheme.cardBg} ${
      isDark ? 'shadow-gray-900 hover:shadow-gray-900/50' : 'shadow-sm hover:shadow-md'
    }`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${scheme.iconBg} ${scheme.iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4">
          {trend === 'up' ? (
            <TrendingUp size={16} className={`${scheme.trendUp} mr-1`} />
          ) : (
            <TrendingDown size={16} className={`${scheme.trendDown} mr-1`} />
          )}
          <span className={`text-sm font-medium ${
            trend === 'up' ? scheme.trendUp : scheme.trendDown
          }`}>
            {Math.abs(change)}% since last month
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
