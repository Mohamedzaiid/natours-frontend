'use client';

import { useState } from 'react';
import { useData } from '@/app/providers/DataProvider';

export default function CacheDebugger() {
  const { invalidateCache, cacheStats } = useData();
  const [prefix, setPrefix] = useState('');
  const [stats, setStats] = useState(null);
  
  const handleClearAll = () => {
    invalidateCache(); // Clear all cache
    alert('Cache cleared successfully!');
  };
  
  const handleClearByPrefix = () => {
    if (!prefix.trim()) {
      alert('Please enter a prefix!');
      return;
    }
    
    invalidateCache(null, prefix);
    alert(`Cache with prefix "${prefix}" cleared successfully!`);
    setPrefix('');
  };
  
  const handleViewStats = () => {
    setStats(cacheStats());
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
        <h3 className="text-lg font-semibold mb-3">Cache Debugger</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
          >
            Clear All Cache
          </button>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Cache prefix (e.g. tours)"
              className="border rounded-md px-3 py-2 flex-1"
            />
            <button
              onClick={handleClearByPrefix}
              className="bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700"
            >
              Clear
            </button>
          </div>
          
          <button
            onClick={handleViewStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
          >
            View Cache Stats
          </button>
          
          {stats && (
            <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
              <p>Total Items: {stats.totalItems}</p>
              <p>Active Items: {stats.activeItems}</p>
              <p>Stale Items: {stats.staleItems}</p>
              
              {stats.itemsList.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Cached Items:</p>
                  <div className="max-h-40 overflow-y-auto mt-1">
                    <ul className="space-y-1">
                      {stats.itemsList.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span className="text-gray-700 truncate max-w-[150px]">{item.key}</span>
                          <span className={item.isStale ? 'text-red-600' : 'text-green-600'}>
                            {item.isStale ? 'Stale' : `${item.expiresIn}s`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setStats(null)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>Developer use only - will not appear in production</p>
        </div>
      </div>
    </div>
  );
}
