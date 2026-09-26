import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
