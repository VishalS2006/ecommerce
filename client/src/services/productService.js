import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductByIdOrSlug: async (identifier) => {
    const response = await api.get(`/products/${identifier}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getDealsOfDay: async () => {
    const response = await api.get('/products/deals');
    return response.data;
  },

  getSearchSuggestions: async (query) => {
    const response = await api.get('/products/search/suggestions', {
      params: { q: query }
    });
    return response.data;
  }
};
