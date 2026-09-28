module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false
    },
    deliveryMethod: {
      type: DataTypes.JSON,
      defaultValue: {
        id: 'standard',
        name: 'Standard Delivery',
        price: 5,
        estimatedDays: '2-4 Business Days'
      }
    },
    paymentMethod: {
      type: DataTypes.JSON,
      defaultValue: {
        type: 'cod',
        provider: 'Cash on Delivery',
        transactionId: '',
        cardLast4: ''
      }
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    orderStatus: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    shipping: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    timeline: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    cancelReason: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'orders',
    timestamps: true
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};
