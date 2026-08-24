import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api";

// Create Context
const AuthContext = createContext();

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  // Current logged-in user
  const [user, setUser] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET USER PROFILE
  // ==========================================

  const getProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");

      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);

      // Invalid token ho to remove
      localStorage.removeItem("crs_token");

      setUser(null);

      throw error;
    }
  };

  // ==========================================
  // REGISTER USER
  // ==========================================

  const register = async (formData) => {
    try {
      console.log(
        "Sending registration request:",
        formData
      );

      const response = await api.post(
        "/api/auth/register",
        formData
      );

      console.log(
        "Registration response:",
        response.data
      );

      // IMPORTANT:
      // Response return karna zaroori hai.
      // Isse Register.jsx me await register(form)
      // successful hone par setStep(2) chalega.

      return response.data;

    } catch (error) {
      console.error(
        "Register API error:",
        error.response?.data || error.message
      );

      // IMPORTANT:
      // Error ko dobara throw karna zaroori hai.
      // Warna Register.jsx ko pata nahi chalega
      // ki registration fail hua hai.

      throw error;
    }
  };

  // ==========================================
  // LOGIN USER
  // ==========================================

  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      // Token save
      if (data.token) {
        localStorage.setItem(
          "crs_token",
          data.token
        );
      }

      // User data save in state
      if (data.user) {
        setUser(data.user);
      }

      return data;

    } catch (error) {
      console.error(
        "Login API error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // ==========================================
  // LOGOUT USER
  // ==========================================

  const logout = () => {
    localStorage.removeItem("crs_token");

    setUser(null);
  };

  // ==========================================
  // CHECK USER ON APP LOAD
  // ==========================================

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(
        "crs_token"
      );

      // Token nahi hai
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await getProfile();
      } catch (error) {
        console.log(
          "User session expired or invalid"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    loading,

    register,
    login,
    logout,

    getProfile,

    // Directly set user if needed
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
