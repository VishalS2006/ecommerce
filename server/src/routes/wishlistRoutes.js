import express from 'express';
import {
  getWishlist,
  toggleWishlist,
  moveToCart
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.post('/move-to-cart', moveToCart);

export default router;
