const { User, Product, UserFavorite } = require('../models');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Product.findAll({
      include: [
        {
          model: User,
          as: 'favoritedBy',
          where: { id: req.user.id },
          attributes: []
        }
      ],
      where: { isActive: true },
      attributes: ['id', 'name', 'slug', 'price', 'comparePrice', 'mainImage', 'rating', 'reviewCount', 'stock', 'discount', 'category_id', 'location']
    });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).send('Product not found');

    const existingFavorite = await UserFavorite.findOne({
      where: {
        user_id: req.user.id,
        product_id: productId
      }
    });

    let isFavorite = false;

    if (existingFavorite) {
      await existingFavorite.destroy();
      isFavorite = false;
    } else {
      await UserFavorite.create({
        user_id: req.user.id,
        product_id: productId
      });
      isFavorite = true;
    }

    const userFavs = await UserFavorite.findAll({
      where: { user_id: req.user.id },
      attributes: ['product_id']
    });
    const favIds = userFavs.map(f => f.product_id);

    res.status(200).json({
      success: true,
      isFavorite,
      favorites: favIds,
      message: isFavorite ? 'Added to favorites' : 'Removed from favorites'
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.clearFavorites = async (req, res) => {
  try {
    await UserFavorite.destroy({
      where: { user_id: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Favorites cleared',
      favorites: []
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
