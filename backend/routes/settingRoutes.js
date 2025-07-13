// backend/routes/settingRoutes.js
import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  getSettings,
  updateSettings,
  getPublicSettings,
} from '../controllers/settingController.js';

const router = express.Router();

// ✅ Truly public route
router.get('/public', getPublicSettings);

// ✅ Admin-only routes
router.get('/', protect, isAdmin, getSettings);
router.put('/', protect, isAdmin, updateSettings);

export default router;








