const express = require('express');
const { submitSupportMessage } = require('../controllers/supportController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Customer support contact
 */

/**
 * @swagger
 * /api/support:
 *   post:
 *     tags: [Support]
 *     summary: Submit customer support inquiry (sent to nazarovjamshid522@gmail.com)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Support message submitted successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', submitSupportMessage);

module.exports = router;
