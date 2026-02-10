const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const contactRoutes = require('./routes/contact');
const serviceRoutes = require('./routes/services');
const caseStudyRoutes = require('./routes/caseStudies');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');
const showcaseRoutes = require('./routes/showcase');
const heroRoutes = require('./routes/hero');
const pricingRoutes = require('./routes/pricing');
const testimonialRoutes = require('./routes/testimonials');
const companyRoutes = require('./routes/companies');
const contactInfoRoutes = require('./routes/contactInfo');
const bookingRoutes = require('./routes/booking');
const profileRoutes = require('./routes/profile');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://192.168.0.107:8080',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500, // Increased from 100 to 500
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for admin routes in development
    return process.env.NODE_ENV === 'development';
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital Growth Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/showcase', showcaseRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/profile', profileRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Digital Growth Platform API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Local: http://localhost:${PORT}/health`);
  console.log(`🌐 Network: http://192.168.0.107:${PORT}/health`);
});

module.exports = app;