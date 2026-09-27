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

      // Backend returns { success: true, data: sanitizeUser(user) }
      setUser(response.data.data);

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
      console.log("Sending registration request:", formData);

      const response = await api.post("/api/auth/register", formData);

      console.log("Registration response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Register API error:", error.response?.data || error.message);
      throw error;
    }
  };

  // ==========================================
  // LOGIN USER
  // ==========================================

  // Accepts either a form object { email, password } OR (email, password) separately
  const login = async (formOrEmail, password) => {
    try {
      let email, pwd;
      if (typeof formOrEmail === "object" && formOrEmail !== null) {
        email = formOrEmail.email;
        pwd = formOrEmail.password;
      } else {
        email = formOrEmail;
        pwd = password;
      }

      const response = await api.post("/api/auth/login", { email, password: pwd });

      const data = response.data;

      // Save token
      if (data.token) {
        localStorage.setItem("crs_token", data.token);
      }

      // Backend returns { success, token, data: sanitizeUser(user) }
      const userData = data.data || data.user;
      if (userData) {
        setUser(userData);
      }

      return userData;
    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
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
      const token = localStorage.getItem("crs_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await getProfile();
      } catch (error) {
        console.log("User session expired or invalid");
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
    isAuthenticated: !!user,

    register,
    login,
    logout,

    getProfile,

    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
