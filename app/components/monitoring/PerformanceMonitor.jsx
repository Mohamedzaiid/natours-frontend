'use client';

import { useEffect } from 'react';
import { useData } from '@/app/providers/DataProvider';

export default function PerformanceMonitor() {
  const { cacheStats } = useData();
  
  useEffect(() => {
    // Enable performance monitoring in development only
    if (process.env.NODE_ENV !== 'production') {
      // Log cache statistics every minute
      const intervalId = setInterval(() => {
        const stats = cacheStats();
        console.group('Cache Statistics');
        console.log(`Total Items: ${stats.totalItems}`);
        console.log(`Active Items: ${stats.activeItems}`);
        console.log(`Stale Items: ${stats.staleItems}`);
        
        // Log details about cached items
        if (stats.itemsList.length > 0) {
          console.table(
            stats.itemsList.map(item => ({
              key: item.key,
              age: `${item.age}s`,
              isStale: item.isStale,
              expiresIn: item.isStale ? 'Expired' : `${item.expiresIn}s`
            }))
          );
        }
        console.groupEnd();
      }, 60000); // Log every minute
      
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [cacheStats]);
  
  // This component doesn't render anything
  return null;
}
