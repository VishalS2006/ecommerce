import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/updatedetails', data);
    return response.data;
  },

  updatePassword: async (passwords) => {
    const response = await api.put('/auth/updatepassword', passwords);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post('/auth/addresses', addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/auth/addresses/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/auth/addresses/${addressId}`);
    return response.data;
  }
};
