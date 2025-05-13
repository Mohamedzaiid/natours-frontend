'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TabHandler({ setActiveTab }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'bookings', 'wishlist', 'billing', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, setActiveTab]);
  
  return null; // This component just handles the tab state, no UI
}
