import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Addresses
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

export default router;
