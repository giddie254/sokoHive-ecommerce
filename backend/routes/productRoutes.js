// src/routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addReview,
  deleteReview,
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';
import { getRelatedProducts } from '../controllers/productController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // 👈 Make sure this imports your multer config
import { getFlashDeals } from '../controllers/productController.js';
import { multerErrorHandler } from '../middleware/multerErrorHandler.js';



const router = express.Router();

// 📦 Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/related/:id', getRelatedProducts);
router.get('/flash-deals', getFlashDeals);


// ⭐ Authenticated user routes
router.post('/:id/reviews', protect, addReview);

// 🛠️ Admin-only routes (with image upload)
router.post('/', protect, adminOnly, upload.array('images'), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:productId/reviews/:reviewId', protect, adminOnly, deleteReview);

export default router;
