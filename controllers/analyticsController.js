const { Order, OrderItem, Product, Category, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getAdminAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;

    const now = new Date();
    let startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === '3m') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (range === '1y') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate.setDate(now.getDate() - 30);
    }

    // 1. Core KPIs
    const [
      totalRevenueResult,
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      pendingOrders
    ] = await Promise.all([
      Order.sum('total', {
        where: { orderStatus: { [Op.ne]: 'Cancelled' } }
      }),
      Order.count({
        where: { orderStatus: { [Op.ne]: 'Cancelled' } }
      }),
      User.count({
        where: { role: 'customer' }
      }),
      Product.count({
        where: { isActive: true }
      }),
      Product.count({
        where: {
          isActive: true,
          [Op.and]: literal('"stock" <= "lowStockThreshold"')
        }
      }),
      Order.count({
        where: { orderStatus: 'Pending' }
      })
    ]);

    const totalRevenue = Number(totalRevenueResult) || 0;
    const averageOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    // 2. Revenue & Orders Over Time
    const salesOverTime = await Order.findAll({
      attributes: [
        [fn('TO_CHAR', col('createdAt'), 'YYYY-MM-DD'), 'date'],
        [fn('SUM', col('total')), 'revenue'],
        [fn('COUNT', col('id')), 'orders']
      ],
      where: {
        createdAt: { [Op.gte]: startDate },
        orderStatus: { [Op.ne]: 'Cancelled' }
      },
      group: [fn('TO_CHAR', col('createdAt'), 'YYYY-MM-DD')],
      order: [[fn('TO_CHAR', col('createdAt'), 'YYYY-MM-DD'), 'ASC']],
      raw: true
    });

    const formattedTimeline = salesOverTime.map(item => ({
      date: item.date,
      revenue: Math.round(Number(item.revenue)),
      orders: parseInt(item.orders, 10)
    }));

    // 3. Sales By Category
    const salesByCategory = await OrderItem.findAll({
      attributes: [
        [col('product->category.name'), 'name'],
        [fn('SUM', literal('"OrderItem"."price" * "OrderItem"."quantity"')), 'value'],
        [fn('SUM', col('OrderItem.quantity')), 'units']
      ],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { orderStatus: { [Op.ne]: 'Cancelled' } }
        },
        {
          model: Product,
          as: 'product',
          attributes: [],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: []
            }
          ]
        }
      ],
      group: ['product->category.id', 'product->category.name'],
      order: [[literal('value'), 'DESC']],
      limit: 6,
      raw: true
    });

    const formattedCategorySales = salesByCategory
      .filter(c => c.name)
      .map(c => ({
        name: c.name,
        value: Math.round(Number(c.value) || 0)
      }));

    // 4. Top Selling Products
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        'name',
        'image',
        'price',
        [fn('SUM', col('quantity')), 'totalSold'],
        [fn('SUM', literal('"price" * "quantity"')), 'totalSales']
      ],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { orderStatus: { [Op.ne]: 'Cancelled' } }
        }
      ],
      group: ['product_id', 'name', 'image', 'price'],
      order: [[literal('"totalSold"'), 'DESC']],
      limit: 5,
      raw: true
    });

    // 5. Recent Orders (top 6)
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // 6. Low stock products alert list
    const lowStockProducts = await Product.findAll({
      where: {
        isActive: true,
        [Op.and]: literal('"stock" <= "lowStockThreshold"')
      },
      attributes: ['id', 'name', 'sku', 'stock', 'lowStockThreshold', 'mainImage', 'price', 'category_id'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      limit: 6
    });

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          lowStockCount,
          pendingOrders,
          averageOrderValue,
          conversionRate: '3.4%'
        },
        timeline: formattedTimeline,
        salesByCategory: formattedCategorySales,
        topProducts: topProducts.map(tp => ({
          _id: tp.product_id,
          name: tp.name,
          image: tp.image,
          price: Number(tp.price),
          totalSold: parseInt(tp.totalSold, 10),
          totalSales: Math.round(Number(tp.totalSales))
        })),
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
