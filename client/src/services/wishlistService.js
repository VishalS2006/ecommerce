import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  toggleWishlist: async (productId) => {
    const response = await api.post('/wishlist/toggle', { productId });
    return response.data;
  },

  moveToCart: async (productId) => {
    const response = await api.post('/wishlist/move-to-cart', { productId });
    return response.data;
  }
};
