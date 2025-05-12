"use client";

import { WishlistProvider as WishlistContextProvider } from "@/app/hooks/useWishlist";

export function WishlistProvider({ children }) {
  return <WishlistContextProvider>{children}</WishlistContextProvider>;
}
