const { Order, OrderItem, Product, Cart, CartItem, Notification, User, sequelize } = require('../models');
const { PaymentService } = require('../services/paymentService');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentData,
      discount = 0
    } = req.body;

    if (!items || !items.length) {
      const userCart = await Cart.findOne({
        where: { user_id: req.user.id },
        include: [{ model: CartItem, as: 'items' }]
      });
      if (userCart && userCart.items && userCart.items.length > 0) {
        items = userCart.items.map(ci => ({
          product_id: ci.product_id,
          product: ci.product_id,
          quantity: ci.quantity,
          color: ci.color,
          price: ci.price
        }));
      }
    }

    if (!items || !items.length) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No order items specified and cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.city || !shippingAddress.street) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Please provide full shipping address details' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prodId = item.product_id || item.product;
      const product = await Product.findByPk(prodId, { transaction });
      if (!product || !product.isActive) {
        await transaction.rollback();
        return res.status(404).json({
          message: `Product "${item.name || 'Item'}" is no longer available`
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.mainImage,
        color: item.color || 'Default',
        sku: product.sku
      });
    }

    const shippingCost = deliveryMethod?.price !== undefined ? Number(deliveryMethod.price) : 5;
    const tax = Math.round(subtotal * 0.085 * 100) / 100;
    const total = Math.max(0, subtotal - discount + shippingCost + tax);

    const count = await Order.count();
    const orderNumber = `CRL-${1000 + count + 1}`;

    const paymentResult = await PaymentService.processPayment({
      method: paymentMethod?.type || 'cod',
      amount: total,
      paymentData: paymentData || {},
      orderNumber
    });

    for (const item of validatedItems) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.product_id },
        transaction
      });
    }

    const order = await Order.create({
      orderNumber,
      user_id: req.user.id,
      shippingAddress,
      deliveryMethod: deliveryMethod || {
        id: 'standard',
        name: 'Standard Delivery',
        price: 5,
        estimatedDays: '2-4 Business Days'
      },
      paymentMethod: {
        type: paymentMethod?.type || 'cod',
        provider: paymentResult.provider,
        transactionId: paymentResult.transactionId,
        cardLast4: paymentResult.cardLast4 || ''
      },
      paymentStatus: paymentResult.status,
      orderStatus: 'Pending',
      subtotal,
      discount,
      shipping: shippingCost,
      tax,
      total,
      timeline: [
        {
          status: 'Pending',
          note: 'Order placed successfully and waiting for confirmation.',
          timestamp: new Date()
        }
      ]
    }, { transaction });

    const orderItemsToInsert = validatedItems.map(vi => ({
      ...vi,
      order_id: order.id
    }));
    await OrderItem.bulkCreate(orderItemsToInsert, { transaction });

    const userCart = await Cart.findOne({ where: { user_id: req.user.id }, transaction });
    if (userCart) {
      await CartItem.destroy({ where: { cart_id: userCart.id }, transaction });
      userCart.subtotal = 0;
      await userCart.save({ transaction });
    }

    await Notification.create({
      user_id: req.user.id,
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} for $${order.total.toFixed(2)} has been placed.`,
      type: 'order',
      link: `/orders/${order.id}`
    }, { transaction });

    await transaction.commit();

    const populatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items'
        }
      ]
    });

    if (!order) return res.status(404).send('Order not found');

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Not authorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason = 'Cancelled by customer' } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) return res.status(404).send('Order not found');

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Not authorized to cancel this order');
    }

    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Confirmed') {
      return res.status(400).json({
        message: `Order cannot be cancelled in its current state (${order.orderStatus})`
      });
    }

    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await Product.increment('stock', {
          by: item.quantity,
          where: { id: item.product_id }
        });
      }
    }

    const currentTimeline = Array.isArray(order.timeline) ? [...order.timeline] : [];
    currentTimeline.push({
      status: 'Cancelled',
      note: reason,
      timestamp: new Date()
    });

    order.orderStatus = 'Cancelled';
    order.cancelReason = reason;
    order.timeline = currentTimeline;
    await order.save();

    await Notification.create({
      user_id: order.user_id,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled. Inventory has been restored.`,
      type: 'order',
      link: `/orders/${order.id}`
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const where = {};

    if (status && status !== 'all') {
      where.orderStatus = status;
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { orderNumber: { [Op.iLike]: term } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const offset = (pageNum - 1) * limitNum;

    const { count: totalOrders, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset
    });

    res.status(200).json({
      success: true,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum) || 1,
      currentPage: pageNum,
      data: orders
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) return res.status(404).send('Order not found');

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await Product.increment('stock', {
            by: item.quantity,
            where: { id: item.product_id }
          });
        }
      }
    }

    if (status === 'Delivered' && order.paymentStatus === 'Pending') {
      order.paymentStatus = 'Paid';
    }

    const currentTimeline = Array.isArray(order.timeline) ? [...order.timeline] : [];
    currentTimeline.push({
      status,
      note: note || `Order status updated to ${status} by administrator.`,
      timestamp: new Date()
    });

    order.timeline = currentTimeline;
    await order.save();

    await Notification.create({
      user_id: order.user_id,
      title: `Order Status Updated: ${status}`,
      message: `Your order #${order.orderNumber} is now ${status}.`,
      type: 'order',
      link: `/orders/${order.id}`
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
