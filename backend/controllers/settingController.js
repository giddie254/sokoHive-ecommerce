// src/controllers/settingController.js
import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';

// ✅ Admin: Get all settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({});
  const payload = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  res.json(payload);
});

// ✅ Public: Get limited public settings (used in frontend)
export const getPublicSettings = asyncHandler(async (req, res) => {
  const publicKeys = ['storeName', 'supportEmail', 'themeColor']; // You can add more
  const settings = await Setting.find({ key: { $in: publicKeys } });

  const payload = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  res.json(payload);
});

// ✅ Admin: Update settings
export const updateSettings = asyncHandler(async (req, res) => {
  const inputs = req.body;
  const results = [];

  for (const [key, value] of Object.entries(inputs)) {
    const updated = await Setting.findOneAndUpdate(
      { key },
      { value: value || '' },
      { new: true, upsert: true }
    );
    results.push(updated);
  }

  res.json({ message: 'Settings updated successfully', updated: results });
});
