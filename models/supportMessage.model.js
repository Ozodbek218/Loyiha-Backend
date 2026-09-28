module.exports = (sequelize, DataTypes) => {
  const SupportMessage = sequelize.define('SupportMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    orderNumber: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    targetEmail: {
      type: DataTypes.STRING,
      defaultValue: 'nazarovjamshid522@gmail.com'
    },
    status: {
      type: DataTypes.ENUM('pending', 'read', 'resolved'),
      defaultValue: 'pending'
    },
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.id;
      }
    }
  }, {
    tableName: 'support_messages',
    timestamps: true
  });

  return SupportMessage;
};
