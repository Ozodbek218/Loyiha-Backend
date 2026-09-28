const nodemailer = require('nodemailer');
const { SupportMessage, Notification, User } = require('../models');

const TARGET_EMAIL = 'nazarovjamshid522@gmail.com';

exports.submitSupportMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, orderNumber, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Name, email, subject, and message are required.'
      });
    }

    const supportDoc = await SupportMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      orderNumber: orderNumber || '',
      message,
      targetEmail: TARGET_EMAIL
    });

    try {
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      for (const admin of adminUsers) {
        await Notification.create({
          user_id: admin.id,
          title: `New Help Request from ${name}`,
          message: `Subject: ${subject} | Order: ${orderNumber || 'N/A'}. Routed to ${TARGET_EMAIL}`,
          type: 'support',
          link: '/admin',
          isRead: false
        });
      }
    } catch (notifErr) {
      console.warn('[Support] Admin notification creation warning:', notifErr.message);
    }

    try {
      if (process.env.SMTP_USER || process.env.EMAIL_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || process.env.EMAIL_USER,
            pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: `"CORELY Help Center" <${process.env.SMTP_USER || TARGET_EMAIL}>`,
          to: TARGET_EMAIL,
          replyTo: email,
          subject: `[CORELY Support] ${subject} - From ${name}`,
          text: message
        });
        supportDoc.emailSent = true;
        await supportDoc.save();
      }
    } catch (emailErr) {
      console.warn(`[Support] Direct SMTP send error: ${emailErr.message}`);
    }

    return res.status(201).json({
      success: true,
      message: `Xabaringiz qabul qilindi va ${TARGET_EMAIL} manziliga yuborildi!`,
      targetEmail: TARGET_EMAIL,
      data: {
        id: supportDoc.id,
        name: supportDoc.name,
        email: supportDoc.email,
        subject: supportDoc.subject,
        createdAt: supportDoc.createdAt
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
