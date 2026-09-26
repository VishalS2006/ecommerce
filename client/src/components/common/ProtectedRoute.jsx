import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { warning } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (adminRequired && user?.role !== 'admin') {
    warning('Access denied: Administrator privileges required.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
