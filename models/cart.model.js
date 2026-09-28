module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    subtotal: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'carts',
    timestamps: true
  });

  Cart.prototype.calculateSubtotal = function () {
    if (this.items && Array.isArray(this.items)) {
      this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
    return this.subtotal;
  };

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'items',
      onDelete: 'CASCADE'
    });
  };

  return Cart;
};
