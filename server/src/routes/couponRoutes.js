import express from 'express';
import {
  validateCoupon,
  getPublicCoupons
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicCoupons);
router.post('/validate', protect, validateCoupon);

export default router;
