# 🛡️ Phishing Detection and Response System

A comprehensive, production-ready web application that helps users detect and analyze potentially malicious websites to protect against phishing attacks.

## 🏗️ Project Structure

```
phishing-detection-system/
├── 📁 backend/                    # Node.js Backend API
│   ├── 📁 api/                   # API route handlers
│   ├── 📁 config/                # Configuration files
│   ├── 📁 services/              # Business logic services
│   ├── 📁 middleware/            # Express middleware
│   ├── 📁 utils/                 # Utility functions
│   ├── 📁 tests/                 # Backend tests
│   ├── 📁 data/                  # Local data storage
│   ├── 📄 server.js              # Main server entry point
│   └── 📄 package.json           # Backend dependencies
│
├── 📁 frontend/                   # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/        # React components
│   │   ├── 📁 pages/            # Page components
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 context/          # React context providers
│   │   ├── 📁 services/         # API services
│   │   ├── 📁 utils/            # Utility functions
│   │   ├── 📁 types/            # TypeScript definitions
│   │   └── 📁 assets/           # Static assets
│   ├── 📁 public/               # Public static files
│   ├── 📁 build/                # Production build output
│   └── 📄 package.json          # Frontend dependencies
│
├── 📁 docs/                      # Documentation
│   ├── 📄 PROJECT_STRUCTURE.md  # Detailed project structure
│   └── 📄 ARCHITECTURE.md       # Architecture overview
│
├── 📁 config/                    # Configuration files
│   └── 📄 .env                  # Environment variables
│
├── 📁 deployment/                # Deployment configurations
│   ├── 📄 render.yaml           # Render deployment config
│   └── 📄 vercel.json           # Vercel deployment config
│
├── 📁 tests/                     # Integration tests
│   └── 📄 test-virustotal.js    # VirusTotal API tests
│
├── 📁 scripts/                   # Utility scripts
└── 📄 package.json              # Root package.json (workspace)
```

## ✨ Features

- **🔍 Real-time URL Analysis**: Instant security analysis with comprehensive risk assessment
- **📊 Risk Scoring**: Advanced scoring system with detailed breakdowns
- **🛡️ Multi-layer Detection**: URL structure, domain analysis, content scanning, SSL validation, and VirusTotal threat intelligence
- **💡 Smart Recommendations**: Actionable security advice based on analysis results
- **🎨 Modern UI**: Beautiful, responsive interface with real-time validation
- **🔄 Fallback System**: Client-side analysis when backend is unavailable
- **📈 Analytics Dashboard**: Track analysis statistics and trends
- **🚀 Production Ready**: Fully deployed and error-free

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Lucide React** for beautiful icons
- **Axios** for API communication
- **Deployed on Vercel** with optimized builds

### Backend
- **Node.js** with Express
- **Cheerio** for web content analysis
- **URL-Parse** for URL structure analysis
- **Whois** for domain information
- **Rate limiting** and security middleware
- **Deployed on Render** with auto-scaling

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phishing-detection-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cp config/.env.example config/.env
   # Edit config/.env with your API keys
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:10000

## 📋 Available Scripts

### Root Level Scripts
```bash
npm run dev              # Start both frontend and backend
npm start                # Start backend server only
npm run build            # Build frontend for production
npm run install-all      # Install all dependencies
npm test                 # Run all tests
npm run clean            # Clean all node_modules
```

### Backend Scripts
```bash
npm run backend:dev      # Start backend with nodemon
npm run backend:start    # Start backend server
npm run backend:test     # Run backend tests
npm run backend:install  # Install backend dependencies
```

### Frontend Scripts
```bash
npm run frontend:dev     # Start frontend development server
npm run frontend:build   # Build frontend for production
npm run frontend:test    # Run frontend tests
npm run frontend:install # Install frontend dependencies
```

## 🔧 API Endpoints

### Health Check
```bash
GET /api/health
```

### URL Analysis
```bash
POST /api/detect
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Analytics
```bash
GET /api/analytics
```

## 🔍 Analysis Features

### 🌐 URL Structure Analysis
- Protocol validation (HTTP vs HTTPS)
- IP address detection
- Suspicious character patterns
- URL length and complexity analysis

### 🏠 Domain Analysis
- Trusted domain verification
- Typosquatting detection
- Domain age checking via WHOIS
- Subdomain pattern analysis

### 📄 Content Analysis
- Web page accessibility testing
- Suspicious content pattern detection
- Form field analysis
- External resource tracking

### 🔒 SSL Security
- Certificate validation
- Protocol security assessment
- Encryption strength evaluation

## ⚖️ Risk Levels

- **🟢 LOW**: Safe to visit (0-19 points)
- **🟡 LOW-MEDIUM**: Proceed with caution (20-39 points)
- **🟠 MEDIUM**: Suspicious characteristics (40-69 points)
- **🔴 HIGH**: Likely phishing (70+ points)

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with intelligent throttling
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Comprehensive URL and data validation
- **Security Headers**: Helmet.js for enhanced security
- **Error Handling**: Graceful error management without information leakage

## 🚀 Deployment

### Production Deployment
The application is configured for deployment on:
- **Frontend**: Vercel
- **Backend**: Render

### Environment Variables
```bash
# VirusTotal Configuration
VIRUSTOTAL_ENABLED=true
VIRUSTOTAL_API_KEY=your_api_key_here

# Application Configuration
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run backend tests
npm run backend:test

# Run frontend tests
npm run frontend:test

# Test VirusTotal integration
node tests/test-virustotal.js
```

## 📊 Production Features

✅ **Error-Free Deployment**: All build and deployment issues resolved
✅ **Optimized Performance**: Fast loading and responsive design
✅ **Comprehensive Analysis**: Multi-layer phishing detection
✅ **User-Friendly Interface**: Intuitive and accessible design
✅ **Reliable Fallback**: Works even when backend is unavailable
✅ **Production Monitoring**: Health checks and error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Security Notice

This tool is designed for educational and informational purposes. While it provides comprehensive analysis using multiple detection methods, it should complement (not replace) other security measures. Always exercise caution when visiting unknown websites and never enter sensitive information on suspicious sites.

## 🎯 What's Next?

The system is production-ready, but here are potential enhancements:
- 🔐 User authentication and personal dashboards
- 🗄️ Database integration for persistent storage
- 🤖 Machine learning-based detection improvements
- 📱 Mobile app development
- 🌍 Multi-language support

---

**🚀 Ready to use!** The phishing detection system is fully deployed and functional. Visit the live application to start protecting yourself from malicious websites.