const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Media and image file uploads
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload product images (Admin only, up to 8 images)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully, returns file URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/', protect, authorize('admin'), upload.array('images', 8), uploadImage);

module.exports = router;
