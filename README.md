# 🛡️ Phishing Detection and Response System

A comprehensive, production-ready web application that helps users detect and analyze potentially malicious websites to protect against phishing attacks.

## ✨ Features

- **🔍 Real-time URL Analysis**: Instant security analysis with comprehensive risk assessment
- **📊 Risk Scoring**: Advanced scoring system with detailed breakdowns
- **🛡️ Multi-layer Detection**: URL structure, domain analysis, content scanning, and SSL validation
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

### Option 1: Use the Live Application
The application is already deployed and ready to use:
- **Frontend**: [Visit the live app](https://phishing-detection-response-system.vercel.app)
- **Backend API**: [API Health Check](https://phishing-detection-api.onrender.com/api/health)

### Option 2: Local Development

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd phishing-detection-system
   npm run install-all
   ```

2. **Start development**
   ```bash
   npm run dev
   ```

3. **Access locally**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API services with fallback
│   │   └── types.ts           # TypeScript definitions
│   ├── vercel.json           # Vercel deployment config
│   └── .nvmrc               # Node version specification
├── src/                      # Backend source
│   ├── config/              # Storage and configuration
│   ├── models/              # Data models
│   └── phishingDetector.js  # Core detection engine
├── vercel.json              # Root deployment config
├── render.yaml              # Backend deployment config
└── DEPLOYMENT_GUIDE.md      # Complete deployment instructions
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

## 🛠️ Development

### Available Scripts
- `npm start` - Start backend server
- `npm run dev` - Start both frontend and backend
- `npm run client` - Start only frontend
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

### Environment Configuration
The system automatically handles environment configuration for both development and production.

## 🚀 Deployment

### ✅ Already Deployed
The application is fully deployed and functional:
- **Frontend**: Vercel (with optimized builds)
- **Backend**: Render (with auto-scaling)

### 📋 Deployment Guide
For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔄 Smart Fallback System

The application includes intelligent fallback mechanisms:

1. **Primary**: Full backend analysis with comprehensive checks
2. **Fallback**: Client-side basic analysis when backend is unavailable
3. **Graceful Degradation**: Users always get security analysis

## 🧪 Testing

### Live Testing
- Visit the deployed application
- Test with various URLs (legitimate and suspicious)
- Verify both backend and fallback analysis work

### Local Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test URL analysis
curl -X POST http://localhost:5000/api/detect \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with intelligent throttling
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Comprehensive URL and data validation
- **Security Headers**: Helmet.js for enhanced security
- **Error Handling**: Graceful error management without information leakage

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