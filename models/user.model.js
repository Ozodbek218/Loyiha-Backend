const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      allowNull: false,
      defaultValue: 'customer'
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    addresses: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  // Password hashing hook
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  // Compare passwords
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Generate JWT token
  User.prototype.getSignedJwtToken = function () {
    return jwt.sign(
      { id: this.id, role: this.role },
      process.env.JWT_SECRET || 'corely_super_secure_jwt_secret_key_2026_modern_ecommerce',
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  };

  User.associate = (models) => {
    User.hasOne(models.Cart, {
      foreignKey: 'user_id',
      as: 'cart',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });

    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications'
    });

    User.belongsToMany(models.Product, {
      through: models.UserFavorite,
      foreignKey: 'user_id',
      otherKey: 'product_id',
      as: 'favorites'
    });
  };

  return User;
};
