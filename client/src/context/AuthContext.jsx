import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsphere_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopsphere_token') || null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Validate session on load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('shopsphere_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('shopsphere_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.success && data.token) {
        localStorage.setItem('shopsphere_token', data.token);
        localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        success(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.customMessage || 'Login failed. Please check your credentials.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success && data.token) {
        localStorage.setItem('shopsphere_token', data.token);
        localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        success(data.message || 'Registration successful!');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.customMessage || 'Registration failed. Please try again.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
    setToken(null);
    setUser(null);
    if (notify) success('Logged out successfully.');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('shopsphere_user', JSON.stringify(res.user));
        success('Profile updated successfully!');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      error(err.customMessage || 'Failed to update profile');
      return { success: false, message: err.customMessage };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('shopsphere_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Refresh user error:', err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
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
