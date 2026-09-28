const express = require('express');
const { getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Store performance, sales metrics, and administrative statistics
 */

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     tags: [Analytics]
 *     summary: Get dashboard analytics overview (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including total revenue, orders, customers, and top selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 124500.00
 *                 totalOrders:
 *                   type: integer
 *                   example: 412
 *                 totalCustomers:
 *                   type: integer
 *                   example: 189
 *                 recentOrders:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
