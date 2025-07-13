import express from 'express';
import {
  getSections,
  updateSections,
  seedSections,
  getHomepageData,
  getTestimonials,
  getFeaturedCategories,
} from '../controllers/homepageController.js';

import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin section manager
router.get('/sections', getSections);
router.put('/sections', protect, isAdmin, updateSections);
router.post('/sections/seed', protect, isAdmin, seedSections);

// Homepage content endpoints
router.get('/', getHomepageData); 
router.get('/testimonials', getTestimonials);
router.get('/categories/featured', getFeaturedCategories);

export default router;

