const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All order routes require auth

router.get('/admin/all', authorize('admin'), getAllOrdersAdmin);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
