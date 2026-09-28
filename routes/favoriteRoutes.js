const express = require('express');
const {
  getFavorites,
  toggleFavorite,
  clearFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorites management
 */

router.use(protect);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get all favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   delete:
 *     tags: [Favorites]
 *     summary: Clear all favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites cleared
 */
router.delete('/', clearFavorites);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Toggle product in favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite toggled
 */
router.post('/:productId', toggleFavorite);

module.exports = router;
