'use client';

import { AuthProvider } from './AuthProvider';
import AuthWrapper from './AuthWrapper';
import { ThemeProvider } from './theme/ThemeProvider';
import { WishlistProvider } from './WishlistProvider';
import { AuthPromptProvider } from './AuthPromptProvider';
import { DataProvider } from './DataProvider';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <AuthPromptProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </AuthPromptProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
