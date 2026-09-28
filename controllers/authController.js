const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Product, UserFavorite } = require('../models');

// Helper to send response with JWT token
const sendTokenResponse = async (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  const userFavs = await UserFavorite.findAll({
    where: { user_id: user.id },
    attributes: ['product_id']
  });
  const favorites = userFavs.map(f => f.product_id);

  const userData = {
    id: user.id,
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    addresses: user.addresses || [],
    favorites
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userData
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: 'customer'
    });

    await sendTokenResponse(user, 201, res, 'Registration successful');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          as: 'favorites',
          attributes: ['id', 'name', 'price', 'comparePrice', 'mainImage', 'rating', 'reviewCount', 'stock', 'discount', 'slug']
        }
      ]
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar, addresses } = req.body;

    const fieldsToUpdate = {};
    if (firstName) fieldsToUpdate.firstName = firstName;
    if (lastName) fieldsToUpdate.lastName = lastName;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (addresses) fieldsToUpdate.addresses = addresses;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send('User not found');

    await user.update(fieldsToUpdate);

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          as: 'favorites',
          attributes: ['id', 'name', 'price', 'comparePrice', 'mainImage', 'rating', 'reviewCount', 'stock', 'discount', 'slug']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    const user = await User.findByPk(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    await sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email?.toLowerCase() } });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists in our records, a password reset link has been dispatched.'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      resetToken
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    await sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.firebaseAuth = async (req, res) => {
  try {
    const { email, name, avatar, uid } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required from Firebase authentication' });
    }

    let user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      const parts = (name || 'Customer User').trim().split(' ');
      const firstName = parts[0] || 'Customer';
      const lastName = parts.slice(1).join(' ') || 'User';
      const randomPassword = `G_Auth#${uid || Date.now()}!${Math.random().toString(36).slice(2, 10)}`;

      user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: randomPassword,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'customer',
        isActive: true
      });
    }

    await sendTokenResponse(user, 200, res, 'Signed in with Firebase successfully');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
