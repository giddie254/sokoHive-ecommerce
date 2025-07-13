// routes/publicSettingsRoutes.js
import express from 'express';
import { getPublicSettings } from '../controllers/settingController.js';

const router = express.Router();
router.get('/settings', getPublicSettings); // becomes /api/public/settings
export default router;
