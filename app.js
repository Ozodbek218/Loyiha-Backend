const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const { sequelize } = require('./models');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const supportRoutes = require('./routes/supportRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');

const app = express();

// Database Connection & Synchronization
let isDbConnected = false;

sequelize.authenticate()
  .then(() => {
    isDbConnected = true;
    console.log('[PostgreSQL] Connected successfully to database');
    if (!process.env.VERCEL) {
      return sequelize.sync();
    }
  })
  .then(() => {
    if (!process.env.VERCEL && isDbConnected) {
      console.log('[PostgreSQL] Database models synchronized successfully');
    }
  })
  .catch((error) => {
    isDbConnected = false;
    console.error('[PostgreSQL] Database connection notice:', error.message);
  });

// Core Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'CORELY Marketplace API (Loyiha-Backend)',
    version: '1.0.0',
    database: isDbConnected ? 'connected' : 'disconnected (configure DATABASE_URL in Vercel Environment Variables)',
    docs: '/api-docs',
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'CORELY Marketplace API (PostgreSQL + Sequelize)',
    version: '1.0.0',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/support', supportRoutes);

// Swagger API Documentation (OpenAPI 3.0)
app.use('/api-docs', swaggerRoutes);
app.use('/docs', swaggerRoutes);

// Fallback 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on CORELY server`
  });
});

// Centralized error handler
app.use(errorHandler);

// Only listen when run directly (not when imported by Vercel serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[CORELY Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    console.log(`[Swagger UI] Interactive API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
