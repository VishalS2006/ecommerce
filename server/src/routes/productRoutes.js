import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getDealsOfDay,
  getSearchSuggestions
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/deals', getDealsOfDay);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:identifier', getProductByIdOrSlug);

export default router;
