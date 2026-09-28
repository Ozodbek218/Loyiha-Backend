const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSearchSuggestions,
  bulkImportProducts
} = require('../controllers/productController');
const {
  getProductReviews,
  createReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/search/suggestions', getSearchSuggestions);
router.post('/bulk/import', protect, authorize('admin'), bulkImportProducts);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProductById)
  .patch(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

// Nested review routes
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router;
