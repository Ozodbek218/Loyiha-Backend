const { Product, Category } = require('../models');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      priceRange,
      color,
      rating,
      shipping,
      inStock,
      onSale,
      newArrival,
      featured,
      sort = 'featured'
    } = req.query;

    const where = { isActive: true };

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { brand: { [Op.iLike]: term } },
        { sku: { [Op.iLike]: term } },
        { description: { [Op.iLike]: term } }
      ];
    }

    if (category && category !== 'all') {
      if (!isNaN(category)) {
        where.category_id = parseInt(category, 10);
      } else {
        const catDoc = await Category.findOne({ where: { slug: category } });
        if (catDoc) {
          where.category_id = catDoc.id;
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && minPrice !== '') where.price[Op.gte] = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') where.price[Op.lte] = Number(maxPrice);
    } else if (priceRange) {
      where.price = {};
      if (priceRange === '0-50') {
        where.price[Op.gte] = 0;
        where.price[Op.lte] = 50;
      } else if (priceRange === '50-75') {
        where.price[Op.gte] = 50;
        where.price[Op.lte] = 75;
      } else if (priceRange === '75-150') {
        where.price[Op.gte] = 75;
        where.price[Op.lte] = 150;
      } else if (priceRange === 'over-150') {
        where.price[Op.gte] = 150;
      }
    }

    if (rating) {
      where.rating = { [Op.gte]: Number(rating) };
    }

    if (shipping) {
      const shippingList = Array.isArray(shipping) ? shipping : shipping.split(',');
      where.shippingInfo = { [Op.in]: shippingList };
    }

    if (inStock === 'true' || inStock === true) {
      where.stock = { [Op.gt]: 0 };
    }
    if (onSale === 'true' || onSale === true) {
      where.isOnSale = true;
    }
    if (newArrival === 'true' || newArrival === true) {
      where.isNewArrival = true;
    }
    if (featured === 'true' || featured === true) {
      where.isFeatured = true;
    }

    let order = [];
    switch (sort) {
      case 'rating':
        order = [['rating', 'DESC'], ['reviewCount', 'DESC']];
        break;
      case 'priceAsc':
        order = [['price', 'ASC']];
        break;
      case 'priceDesc':
        order = [['price', 'DESC']];
        break;
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'popular':
        order = [['reviewCount', 'DESC'], ['rating', 'DESC']];
        break;
      case 'discount':
        order = [['discount', 'DESC']];
        break;
      case 'featured':
      default:
        order = [['isFeatured', 'DESC'], ['createdAt', 'DESC']];
        break;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

    const { count: totalProducts, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order,
      limit: limitNum,
      offset
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      currentPage: pageNum,
      limit: limitNum,
      data: products
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, data: [] });
    }

    const term = `%${q.trim()}%`;
    const suggestions = await Product.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: term } },
          { brand: { [Op.iLike]: term } },
          { sku: { [Op.iLike]: term } }
        ]
      },
      attributes: ['id', 'name', 'slug', 'price', 'mainImage', 'rating', 'category_id', 'brand', 'discount'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      limit: 8
    });

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let where;

    if (!isNaN(id)) {
      where = { id: parseInt(id, 10) };
    } else {
      where = { slug: id };
    }

    const product = await Product.findOne({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        }
      ]
    });

    if (!product) return res.status(404).send('Product not found');

    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id },
        isActive: true
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      limit: 4
    });

    res.status(200).json({
      success: true,
      data: product,
      related: relatedProducts
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populated = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populated || product
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    if (req.body.comparePrice !== undefined || req.body.price !== undefined) {
      const price = req.body.price !== undefined ? req.body.price : product.price;
      const comparePrice = req.body.comparePrice !== undefined ? req.body.comparePrice : product.comparePrice;
      if (comparePrice > price) {
        req.body.discount = Math.round(((comparePrice - price) / comparePrice) * 100);
        req.body.isOnSale = true;
      } else {
        req.body.discount = 0;
        req.body.isOnSale = false;
      }
    }

    await product.update(req.body);

    const updated = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    const prodData = product.toJSON();
    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: prodData
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.bulkImportProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid products array' });
    }

    const inserted = await Product.bulkCreate(products);
    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} products`,
      count: inserted.length
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
