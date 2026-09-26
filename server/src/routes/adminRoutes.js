import express from 'express';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getAdminOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getAdminCustomers,
  updateCustomerStatus
} from '../controllers/adminController.js';
import {
  getAdminCoupons,
  createCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require admin authentication for all routes in this router
router.use(protect, adminOnly);

// Stats & Metrics
router.get('/stats', getDashboardStats);

// Products
router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/stock', updateProductStock);

// Orders
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/payment-status', updateOrderPaymentStatus);

// Customers
router.get('/customers', getAdminCustomers);
router.put('/customers/:id/status', updateCustomerStatus);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
