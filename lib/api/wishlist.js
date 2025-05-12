// Wishlist API functions

// Get user's wishlist from the server
export const fetchWishlist = async () => {
  try {
    console.log('Fetching wishlist data');
    const response = await fetch('/api/wishlist', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch wishlist');
    }

    const data = await response.json();
    console.log('Wishlist fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add a tour to the wishlist
export const addToWishlist = async (tourId) => {
  try {
    console.log('Adding tour to wishlist:', tourId);
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ tourId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to wishlist');
    }

    const data = await response.json();
    console.log('Tour added to wishlist successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove a tour from the wishlist
export const removeFromWishlist = async (tourId) => {
  try {
    console.log('Removing tour from wishlist:', tourId);
    const response = await fetch(`/api/wishlist/${tourId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove from wishlist');
    }

    const data = await response.json();
    console.log('Tour removed from wishlist successfully:', data);
    return data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Clear the entire wishlist
export const clearWishlist = async () => {
  try {
    console.log('Clearing wishlist');
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to clear wishlist');
    }

    const data = await response.json();
    console.log('Wishlist cleared successfully:', data);
    return data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Sync local wishlist with server
export const syncWishlist = async (wishlistItems) => {
  try {
    console.log('Syncing wishlist with server:', wishlistItems);
    const response = await fetch('/api/wishlist/sync', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ wishlistItems })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sync wishlist');
    }

    const data = await response.json();
    console.log('Wishlist synced successfully:', data);
    return data;
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    throw error;
  }
};
