'use client';

import { useAuth } from './AuthProvider';

export default function AuthWrapper({ children }) {
  // Simply passing children through without any loading screen
  return <>{children}</>;
}
