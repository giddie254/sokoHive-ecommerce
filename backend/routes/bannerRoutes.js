import express from 'express';
import {
  getBanners,
  createBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/bannerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET /api/banners
// POST /api/banners
router
  .route('/')
  .get(getBanners)
  .post(protect, isAdmin, upload.single('image'), createBanner);

// DELETE /api/banners/:id
router
  .route('/:id')
  .delete(protect, isAdmin, deleteBanner);

// PUT /api/banners/:id/toggle
router
  .put('/:id/toggle', protect, isAdmin, toggleBannerStatus);

export default router;
