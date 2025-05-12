// Backend API access via our own API routes

export async function loginUser(email, password) {
  try {
    console.log("Logging in user:", email);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      credentials: "include", // Important to include for cookie handling
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login error response:", data);
      throw new Error(data.message || "Login failed");
    }

    console.log("Login successful");
    return data;
  } catch (error) {
    console.error("Login fetch error:", error);
    throw error;
  }
}

export async function signupUser(userData) {
  try {
    console.log("Signing up user:", userData.email);
    
    // Validate data before sending
    if (!userData.name || !userData.email || !userData.password || !userData.passwordConfirm) {
      throw new Error("Please fill in all required fields");
    }
    
    if (userData.password !== userData.passwordConfirm) {
      throw new Error("Passwords do not match");
    }
    
    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      credentials: "include", // Include credentials for cookie handling
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Unexpected response from server");
    }

    if (!response.ok) {
      console.error("Signup error response:", data);
      throw new Error(data.message || "Signup failed");
    }

    // Check the response data to make sure it has the expected structure
    if (data.status === "success") {
      // Verify that we have user data in the expected location
      const userData = data.data?.user;
      if (!userData) {
        console.warn("Successful signup but missing user data in response:", data);
      } else {
        console.log("Successfully extracted user data from response");
      }
    }

    console.log("Signup successful:", data);
    return data;
  } catch (error) {
    console.error("Signup fetch error:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    console.log("Logging out user");
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include", // Important to include cookies
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // Parse the response
    const data = await response.json();
    console.log("Logout response:", data);

    return data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    console.log("Fetching current user data");

    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // Include cookies
      cache: "no-store", // Don't cache this request
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    console.log("Auth check response status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.log("User not authenticated (401)");
        return { status: "fail", message: "Not authenticated" };
      }

      let errorData = { message: "Unknown error" };
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error response", e);
      }

      console.error("Error fetching user:", errorData);
      return {
        status: "fail",
        message: errorData.message || "Failed to get user data",
      };
    }

    try {
      // Parse the successful response
      const data = await response.json();
      console.log("User data retrieved successfully:", data);
      return data;
    } catch (parseError) {
      console.error("Failed to parse success response", parseError);
      return { status: "error", message: "Failed to parse response" };
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return {
      status: "error",
      message: error.message || "Error fetching user data",
    };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await fetch(`${API_PROXY}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Forgot password request failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(token, password, passwordConfirm) {
  try {
    const response = await fetch(`${API_PROXY}/users/reset-password/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, passwordConfirm }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Password reset failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(
  currentPassword,
  password,
  passwordConfirm
) {
  try {
    const response = await fetch(`${API_PROXY}/users/update-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, password, passwordConfirm }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Password update failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateUserData(data) {
  try {
    const response = await fetch(`${API_PROXY}/users/update-me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user data");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
