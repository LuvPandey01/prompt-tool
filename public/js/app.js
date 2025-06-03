const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import analysis modules
const promptAnalyzer = require('./lib/promptAnalyzer');
const promptEnhancer = require('./lib/promptEnhancer');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Analyze prompt endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid prompt provided. Please provide a valid string.'
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        error: 'Prompt too long. Maximum length is 5000 characters.'
      });
    }

    const analysis = promptAnalyzer.analyze(prompt);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Enhance prompt endpoint
app.post('/api/enhance', async (req, res) => {
  try {
    const { prompt, analysis } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid prompt provided. Please provide a valid string.'
      });
    }

    const enhancement = promptEnhancer.enhance(prompt, analysis);
    res.json(enhancement);
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Get prompt examples
app.get('/api/examples', (req, res) => {
  const examples = [
    {
      category: 'Creative Writing',
      before: 'Write a story.',
      after: 'Write a 500-word short story about a time traveler who accidentally changes a minor historical event. Use third-person narrative, include dialogue, and end with an unexpected twist.',
      improvements: ['Added specific length requirement', 'Specified narrative style', 'Included clear plot elements', 'Defined story structure']
    },
    {
      category: 'Technical Explanation',
      before: 'Explain AI.',
      after: 'Explain artificial intelligence to a high school student with no technical background. Cover the basic definition, how it works in simple terms, provide 3 real-world examples, and explain both benefits and concerns. Keep the explanation under 300 words.',
      improvements: ['Defined target audience', 'Specified complexity level', 'Added structure requirements', 'Set word limit']
    },
    {
      category: 'Data Analysis',
      before: 'Analyze this data.',
      after: 'Analyze the sales data for trends and patterns. Provide: 1) Summary statistics, 2) Identify top 3 trends, 3) Compare year-over-year growth, 4) Recommend actionable next steps. Present findings in a structured report format.',
      improvements: ['Specified analysis type', 'Listed required outputs', 'Added comparison request', 'Defined format']
    }
  ];
  
  res.json(examples);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Prompt Optimizer server running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
});

module.exports = app;