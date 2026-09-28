module.exports = (sequelize, DataTypes) => {
  const UserFavorite = sequelize.define('UserFavorite', {
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
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'user_favorites',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id']
      }
    ]
  });

  UserFavorite.associate = (models) => {
    UserFavorite.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    UserFavorite.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return UserFavorite;
};
