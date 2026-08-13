import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("access_token");
      
      if (token) {
        try {
          const response = await api.get("/users/me");
          setUser(response.data);
          setIsVerified(response.data.is_verified);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("access_token");
          setUser(null);
          setIsVerified(false);
        }
      }
      
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);
      setIsVerified(userResponse.data.is_verified);
      
      return userResponse.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, phoneNumber, role) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone_number: phoneNumber,
        role,
      });

      return response.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsVerified(false);
    setError(null);
  };

  // Update verification status when needed
  const checkVerification = async () => {
    try {
      const response = await api.get("/users/me");
      setIsVerified(response.data.is_verified);
      setUser(response.data);
    } catch (err) {
      console.error("Failed to check verification:", err);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout,
        isVerified,
        checkVerification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
