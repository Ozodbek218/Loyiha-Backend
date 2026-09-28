const { Category, Product } = require('../models');
const { Op } = require('sequelize');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.count({
          where: { category_id: cat.id, isActive: true }
        });
        const catJson = cat.toJSON();
        return { ...catJson, productCount: count };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let whereClause;

    if (!isNaN(id)) {
      whereClause = { id: parseInt(id, 10) };
    } else {
      whereClause = { slug: id };
    }

    const category = await Category.findOne({ where: whereClause });
    if (!category) return res.status(404).send('Category not found');

    const productCount = await Product.count({
      where: { category_id: category.id, isActive: true }
    });

    const catJson = category.toJSON();
    res.status(200).json({
      success: true,
      data: { ...catJson, productCount }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, featured } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = await Category.create({ name, description, image, featured });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');

    await category.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');

    const catData = category.toJSON();
    await category.destroy();
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: catData
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
