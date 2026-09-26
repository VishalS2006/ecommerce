import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts & Guard
import { CustomerLayout } from './components/common/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';

// 404 Page
import { EmptyState } from './components/common/EmptyState';
import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => (
  <div className="py-24 bg-slate-50 flex items-center justify-center">
    <EmptyState
      icon={AlertCircle}
      title="404 — Page Not Found"
      description="The page you are looking for does not exist, has been moved, or is temporarily unavailable."
      actionText="Back to ShopSphere Home"
      actionLink="/"
    />
  </div>
);

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Storefront Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:identifier" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Customer Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderTrackingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 in customer layout */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminRequired={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
