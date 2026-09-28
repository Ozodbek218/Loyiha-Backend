const express = require('express');
const {
  getFavorites,
  toggleFavorite,
  clearFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Favorites require auth

router.route('/')
  .get(getFavorites)
  .delete(clearFavorites);

router.post('/:productId', toggleFavorite);

module.exports = router;
