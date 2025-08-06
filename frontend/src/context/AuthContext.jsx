import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post('/auth/user/login', { email, password, rememberMe });
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);

        setTimeout(async () => {
        try {
            await checkAuth();
          } catch (error) {
            console.error('Error fetching complete profile:', error);
          }
        }, 100);

        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || [];
      toast.error(message);
      return { success: false, message, errors };
    }
  };


  //Profile Update
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.user); // Update the user state
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };


  const logout = async () => {
    try {
      await api.post('/auth/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };


  const sendVerificationEmail = async () => {
    try {
      const response = await api.post('/auth/verify-email');
    
      if (response.data.success) {
      toast.success('📧 Verification email sent! Please check your inbox.', {
        duration: 5000,
        style: {
          background: '#f0f9ff',
          color: '#1e40af',
          border: '1px solid #93c5fd'
        }
      });
      return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send verification email';
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
    
      if (response.data.success) {
      // Refresh user data to update verification status
      await checkAuth();
      toast.success('Email verified successfully!');
      return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await api.post('/auth/google/token', { credential });
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);

        setTimeout(async () => {
          try {
            await checkAuth(); 
          } catch (error) {
            console.error('Error fetching complete profile:', error);
          }
        }, 100);

        toast.success('Google login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, message };
    }
  };


  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
    sendVerificationEmail,
    verifyEmail,
    googleLogin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
