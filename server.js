const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const dotenv = require('dotenv');
const { initStorage, saveAnalysis, getAnalytics } = require('./src/config/localStorage');
const phishingDetector = require('./src/phishingDetector');

// Load environment variables
dotenv.config();

// Initialize local storage
initStorage();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    });
};

app.use('/api', rateLimiterMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Phishing Detection API is running' });
});

// Main phishing detection endpoint
app.post('/api/detect', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    console.log(`Analyzing URL: ${url}`);
    
    // Perform phishing detection
    const result = await phishingDetector.analyzeUrl(url);
    
    // Save analysis result to local storage
    try {
      await saveAnalysis({
        ...result,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (storageError) {
      console.error('Local storage save error:', storageError);
      // Continue without failing the request
    }
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during analysis',
      error: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Phishing Detection Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
