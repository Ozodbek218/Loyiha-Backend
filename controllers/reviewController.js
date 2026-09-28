const { Review, Order, OrderItem, Product, User } = require('../models');
const { Op } = require('sequelize');

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (breakdown[rounded] !== undefined) {
        breakdown[rounded]++;
      }
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      breakdown,
      data: reviews
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ message: 'Please provide rating, title, and comment' });
    }

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).send('Product not found');

    const existingReview = await Review.findOne({
      where: { user_id: req.user.id, product_id: productId }
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this product' });
    }

    if (req.user.role !== 'admin') {
      const hasPurchased = await Order.findOne({
        where: {
          user_id: req.user.id,
          orderStatus: { [Op.in]: ['Delivered', 'Shipped', 'Processing', 'Confirmed', 'Pending'] }
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            where: { product_id: productId }
          }
        ]
      });

      if (!hasPurchased) {
        return res.status(403).json({
          message: 'Only customers who have purchased this product are eligible to leave a review.'
        });
      }
    }

    const review = await Review.create({
      user_id: req.user.id,
      product_id: productId,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true
    });

    const populatedReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).send('Review not found');

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Not authorized to delete this review');
    }

    const reviewData = review.toJSON();
    await review.destroy();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: reviewData
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
