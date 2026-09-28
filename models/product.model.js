const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    name_uz: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_ru: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description_uz: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_ru: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    comparePrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    costPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    colors: {
      type: DataTypes.JSON,
      defaultValue: ['Black']
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    warranty: {
      type: DataTypes.STRING,
      defaultValue: '1 Year Manufacturer Warranty'
    },
    shippingInfo: {
      type: DataTypes.ENUM('Regular', 'Economic', 'Next Day', 'Instant'),
      defaultValue: 'Next Day'
    },
    shippingClass: {
      type: DataTypes.STRING,
      defaultValue: 'Standard Tech'
    },
    deliveryTime: {
      type: DataTypes.STRING,
      defaultValue: '1-3 Business Days'
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: 'Official Corely Hub'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isOnSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isNewArrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    seoTitle: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    metaDescription: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  Product.beforeSave(async (product) => {
    if (product.changed('name')) {
      product.slug = slugify(product.name, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
    }
    if (product.comparePrice > product.price) {
      product.discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
      product.isOnSale = true;
    } else if (product.changed('price') || product.changed('comparePrice')) {
      product.discount = 0;
      product.isOnSale = false;
    }
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });

    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews',
      onDelete: 'CASCADE'
    });

    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems'
    });

    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cartItems',
      onDelete: 'CASCADE'
    });

    Product.belongsToMany(models.User, {
      through: models.UserFavorite,
      foreignKey: 'product_id',
      otherKey: 'user_id',
      as: 'favoritedBy'
    });
  };

  return Product;
};
