module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id']
      }
    ]
  });

  Review.recalculateRating = async function (productId, models) {
    try {
      const Product = models.Product || sequelize.models.Product;
      const reviews = await Review.findAll({
        where: { product_id: productId },
        attributes: ['rating']
      });

      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        const avg = Math.round((sum / reviews.length) * 10) / 10;
        await Product.update(
          { rating: avg, reviewCount: reviews.length },
          { where: { id: productId } }
        );
      } else {
        await Product.update(
          { rating: 0, reviewCount: 0 },
          { where: { id: productId } }
        );
      }
    } catch (err) {
      console.error('[Review] Error recalculating average rating:', err);
    }
  };

  Review.afterSave(async (review) => {
    await Review.recalculateRating(review.product_id, sequelize.models);
  });

  Review.afterDestroy(async (review) => {
    await Review.recalculateRating(review.product_id, sequelize.models);
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return Review;
};
