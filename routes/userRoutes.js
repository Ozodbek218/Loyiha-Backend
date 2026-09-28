const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  createUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All user management routes require admin

router.get('/search', searchUsers);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
