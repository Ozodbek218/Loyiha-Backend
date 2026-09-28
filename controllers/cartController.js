const { Cart, CartItem, Product } = require('../models');

// Helper to populate and recalculate cart
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { user_id: userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'price', 'comparePrice', 'mainImage', 'stock', 'discount', 'sku']
          }
        ]
      }
    ]
  });

  if (!cart) {
    cart = await Cart.create({ user_id: userId, subtotal: 0 });
    cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'price', 'comparePrice', 'mainImage', 'stock', 'discount', 'sku']
            }
          ]
        }
      ]
    });
  }

  // Filter out any items whose product was deleted
  let validItems = [];
  if (cart.items && cart.items.length > 0) {
    for (const item of cart.items) {
      if (!item.product) {
        await item.destroy();
      } else {
        validItems.push(item);
      }
    }
  }

  const subtotal = validItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  cart.subtotal = Math.round(subtotal * 100) / 100;
  await cart.save();

  return cart;
};

exports.getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user.id);
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color = 'Default' } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`
      });
    }

    let [cart] = await Cart.findOrCreate({
      where: { user_id: req.user.id },
      defaults: { user_id: req.user.id, subtotal: 0 }
    });

    const existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId,
        color
      }
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock})`
        });
      }
      existingItem.quantity = newQty;
      await existingItem.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        color,
        price: product.price
      });
    }

    const updatedCart = await getPopulatedCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(404).send('Cart not found');

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id }
    });
    if (!item) return res.status(404).send('Item not found in cart');

    const product = await Product.findByPk(item.product_id);
    if (!product) return res.status(404).send('Product not found');

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Requested quantity exceeds available stock (${product.stock})`
      });
    }

    item.quantity = quantity;
    await item.save();

    const updatedCart = await getPopulatedCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(404).send('Cart not found');

    await CartItem.destroy({
      where: { id: itemId, cart_id: cart.id }
    });

    const updatedCart = await getPopulatedCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id } });
      cart.subtotal = 0;
      await cart.save();
    }

    const updatedCart = await getPopulatedCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
