import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await api.patch(`/admin/products/${id}/stock`, { stock });
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, orderStatus, note) => {
    const response = await api.put(`/admin/orders/${id}/status`, { orderStatus, note });
    return response.data;
  },

  updateOrderPaymentStatus: async (id, paymentStatus) => {
    const response = await api.put(`/admin/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  getCustomers: async (params = {}) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  updateCustomerStatus: async (id, status) => {
    const response = await api.put(`/admin/customers/${id}/status`, { status });
    return response.data;
  },

  getCoupons: async () => {
    const response = await api.get('/admin/coupons');
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await api.post('/admin/coupons', couponData);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }
};
