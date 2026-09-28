module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    storeName: {
      type: DataTypes.STRING,
      defaultValue: 'CORELY'
    },
    tagline: {
      type: DataTypes.STRING,
      defaultValue: 'Technology that fits your world.'
    },
    storeEmail: {
      type: DataTypes.STRING,
      defaultValue: 'nazarovjamshid522@gmail.com'
    },
    storePhone: {
      type: DataTypes.STRING,
      defaultValue: '+998 71 200 00 00'
    },
    announcementText: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    announcementEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    heroBadge: {
      type: DataTypes.STRING,
      defaultValue: 'Next-Generation Electronics & Workstations'
    },
    heroTitle: {
      type: DataTypes.STRING,
      defaultValue: 'Kundalik texnologiyangizni yangilang.'
    },
    heroSubtitle: {
      type: DataTypes.TEXT,
      defaultValue: "Aniq mexanik klaviaturalar, yengil o'yin sichqonchalari va zamonaviy ish stoli uskunalari."
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    taxRate: {
      type: DataTypes.FLOAT,
      defaultValue: 8.5
    },
    freeShippingThreshold: {
      type: DataTypes.FLOAT,
      defaultValue: 100
    },
    standardShippingFee: {
      type: DataTypes.FLOAT,
      defaultValue: 5
    },
    expressShippingFee: {
      type: DataTypes.FLOAT,
      defaultValue: 15
    },
    sameDayShippingFee: {
      type: DataTypes.FLOAT,
      defaultValue: 25
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: '45 Silicon Valley Way, Tech District, Tashkent'
    },
    allowGuestCheckout: {
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
    tableName: 'settings',
    timestamps: true
  });

  return Setting;
};
