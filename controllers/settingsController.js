const { Setting } = require('../models');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      await settings.update(req.body);
    }

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
