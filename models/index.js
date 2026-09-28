const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const models = {};

models.User = require('./user.model')(sequelize, DataTypes);
models.Category = require('./category.model')(sequelize, DataTypes);
models.Product = require('./product.model')(sequelize, DataTypes);
models.Cart = require('./cart.model')(sequelize, DataTypes);
models.CartItem = require('./cartItem.model')(sequelize, DataTypes);
models.Order = require('./order.model')(sequelize, DataTypes);
models.OrderItem = require('./orderItem.model')(sequelize, DataTypes);
models.Review = require('./review.model')(sequelize, DataTypes);
models.Notification = require('./notification.model')(sequelize, DataTypes);
models.Setting = require('./setting.model')(sequelize, DataTypes);
models.SupportMessage = require('./supportMessage.model')(sequelize, DataTypes);
models.UserFavorite = require('./userFavorite.model')(sequelize, DataTypes);

// Run model associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
