"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser, logoutUser, signupUser } from "@/lib/api/auth";
import { getUserBookings } from "@/lib/api/bookings";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Function to fetch user bookings and update user state
  const fetchUserBookings = async (currentUser) => {
    if (!currentUser) return null;
    
    try {
      console.log("Fetching user bookings");
      const bookings = await getUserBookings();
      console.log("User bookings fetched:", bookings?.length || 0);
      
      // Update the user object with bookings
      return {
        ...currentUser,
        bookings: bookings || []
      };
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      // Return user without bookings if there was an error
      return {
        ...currentUser,
        bookings: []
      };
    }
  };

  // Check if user is logged in only once when the app loads
  useEffect(() => {
    // Only check once
    if (authChecked) return;

    const checkLoginStatus = async () => {
      try {
        console.log("Initial authentication check");
        
        // Check with the server to see if we're authenticated
        const data = await getCurrentUser();
        console.log("Server authentication response:", data);
        
        if (data && data.status === "success" && data.data.data) {
          console.log("User is authenticated:", data.data.data.name || data.data.data.email);
          // Get the authenticated user
          let authenticatedUser = data.data.data;
          
          // Fetch user's bookings and update the user object
          authenticatedUser = await fetchUserBookings(authenticatedUser);
          
          // Set the user state with bookings included
          setUser(authenticatedUser);
          
        } else {
          console.log("User is not authenticated, response:", data);
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking login status:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkLoginStatus();

  }, [authChecked]);

  // Function to manually refresh authentication status when needed
  const refreshAuthStatus = async () => {
    try {
      console.log("Manually refreshing auth status");
      const data = await getCurrentUser();
      console.log("refreshAuthStatus: API response:", data);

      if (data && data.status === "success" && data.data) {
        console.log("refreshAuthStatus: User authenticated:", data.data.data.name || data.data.data.email);
        
        // Get user data with bookings
        const userWithBookings = await fetchUserBookings(data.data.data);
        setUser(userWithBookings);
        return true;
      } else {
        console.log("refreshAuthStatus: No valid user data in response");
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error("Error refreshing auth status:", err);
      setUser(null);
      return false;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      console.log("Attempting login for:", email);
      const data = await loginUser(email, password);
      console.log("Login response:", data);
      
      // Successful login response should contain token and user
      if (data && data.status === "success" && data.user) {
        console.log("Login successful, setting user state:", data.user.name || data.user.email);
        
        // Get user data with bookings
        const userWithBookings = await fetchUserBookings(data.user);
        setUser(userWithBookings);
        return { success: true };
      }
      
      console.error("Login response did not contain expected data");
      return { success: false, message: data.message || "Login failed" };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
      return { success: false, message: err.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      console.log("Attempting signup for:", userData.email);
      const data = await signupUser(userData);
      console.log("Signup response:", data);
      
      if (data && data.status === "success") {
        console.log("Signup successful, setting user state");
        
        // For the specific API response structure, where user is in data.data.user
        if (data.data && data.data.user) {
          console.log("User data found in data.data.user:", data.data.user.name || data.data.user.email);
          
          // Get user data with bookings
          const userWithBookings = await fetchUserBookings(data.data.user);
          setUser(userWithBookings);
          
          await refreshAuthStatus();
          return { success: true };
        }
        // Fallback case if structure changes
        else if (data.user) {
          console.log("User data found in data.user:", data.user.name || data.user.email);
          
          // Get user data with bookings
          const userWithBookings = await fetchUserBookings(data.user);
          setUser(userWithBookings);
          
          await refreshAuthStatus();
          return { success: true };
        }
        else {
          console.error("No user data found in signup response");
          return { success: false, message: "Signup succeeded but user data is missing" };
        }
      }
      
      // If we get here, there was an unexpected response format
      console.error("Unexpected signup response format:", data);
      return { success: false, message: data.message || "Signup failed with unexpected response" };
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
      return { success: false, message: err.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      // Clear user state immediately for better UI experience
      setUser(null);
      
      // Call the logout API
      const response = await logoutUser();
      console.log("Logout response:", response);
      
      // Force a hard client-side navigation to get a fresh page state
      window.location.href = "/";
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "An error occurred during logout");
      return { success: false, message: err.message || "Logout failed" };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    refreshAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
