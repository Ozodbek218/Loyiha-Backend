const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Store settings and configuration
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get marketplace settings
 *     responses:
 *       200:
 *         description: Marketplace settings
 */
router.route('/')
  .get(getSettings)
  /**
   * @swagger
   * /api/settings:
   *   patch:
   *     tags: [Settings]
   *     summary: Update marketplace settings (Admin only)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Settings updated
   */
  .patch(protect, authorize('admin'), updateSettings);

module.exports = router;
