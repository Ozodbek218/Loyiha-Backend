const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.array('images', 8), uploadImage);

module.exports = router;
