import express from 'express';
import { getCategories } from '../controllers/productController.js';
import { createCategory } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);

export default router;
