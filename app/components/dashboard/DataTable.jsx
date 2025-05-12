'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { useTheme } from '@/app/providers/theme/ThemeProvider';

export const DataTable = ({ 
  title, 
  description, 
  columns, 
  data,
  actionUrl,
  actionText = 'View All',
  onActionClick,
  emptyStateMessage = 'No data available',
  onRowClick,
  showSearch = true,
  showFilter = false
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Handle sorting
  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  let filteredData = [...data];
  
  if (searchTerm) {
    filteredData = filteredData.filter(item => {
      return columns.some(column => {
        if (!column.searchable) return false;
        const value = column.accessor(item);
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }

  if (sortColumn) {
    const column = columns.find(col => col.id === sortColumn);
    if (column) {
      filteredData.sort((a, b) => {
        const aValue = column.accessor(a);
        const bValue = column.accessor(b);
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle number comparison
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      });
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
          {actionUrl && (
            <Link href={actionUrl} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center transition-colors">
              {actionText}
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          )}
          {onActionClick && !actionUrl && (
            <button 
              onClick={onActionClick}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center transition-colors"
            >
              {actionText}
              <ArrowUpRight size={14} className="ml-1" />
            </button>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        {(showSearch || showFilter) && (
          <div className="mt-4 flex items-center gap-3">
            {showSearch && (
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors focus:shadow-md"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            )}
            
            {showFilter && (
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border ${
                  showFilters 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                    : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
              >
                <Filter size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Filter Panel - shown when filters are enabled */}
        {showFilters && showFilter && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Filter options will be implemented in Phase 2</p>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        {filteredData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.id}
                    onClick={() => column.sortable ? handleSort(column.id) : null}
                    className={`px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                    } ${column.className || ''}`}
                  >
                    <div className="flex items-center">
                      <span className={column.sortable ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>
                        {column.header}
                      </span>
                      {column.sortable && sortColumn === column.id && (
                        <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                          {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''} transition-colors`}
                >
                  {columns.map(column => {
                    // Extract key cell types for special rendering
                    const isRole = column.id === 'role';
                    const isStatus = column.id === 'status' || column.id === 'paid';
                    const isDifficulty = column.id === 'difficulty';
                    const isPrice = column.id === 'price';
                    
                    return (
                      <td 
                        key={`${rowIndex}-${column.id}`} 
                        className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                      >
                        {column.cell ? (
                          // Apply the custom cell renderer but enhance certain types of cells
                          isRole || isStatus || isDifficulty || isPrice ? (
                            <div className="cell-wrapper">
                              {column.cell(row, { isDark })} {/* Pass isDark to cell renderer */}
                            </div>
                          ) : column.cell(row)
                        ) : (
                          <span className={`text-sm ${column.dataClassName || 'text-gray-900 dark:text-white'}`}>
                            {column.accessor(row)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-10">
            <p className="text-sm text-gray-500 dark:text-gray-400">{emptyStateMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
