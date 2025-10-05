# 🏗️ Phishing Detection System - Architecture Overview

## 📋 Quick Reference

### **Project Structure**
```
phishing-detection-system/
├── client/                 # React Frontend (TypeScript)
├── src/                    # Node.js Backend
├── data/                   # Local data storage
├── server.js              # Main server entry point
├── package.json           # Backend dependencies
└── .env                   # Environment configuration
```

### **Tech Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Security Middleware
- **APIs**: VirusTotal API v3 + Domain Reputation Services
- **Deployment**: Vercel (Frontend) + Render (Backend)

### **Key Components**
- **URL Analysis Engine** - Multi-layer phishing detection
- **VirusTotal Integration** - Threat intelligence API
- **Domain Reputation** - WHOIS and reputation checking
- **Real-time UI** - Modern React interface with theme support

### **API Endpoints**
- `GET /api/health` - Health check
- `POST /api/detect` - Main URL analysis
- `POST /api/virus-total` - Direct VirusTotal check
- `GET /api/analytics` - System analytics

### **Security Features**
- Rate limiting (50 requests/minute)
- CORS protection
- Helmet security headers
- Input validation and sanitization

### **Development Commands**
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production
```

### **Environment Variables**
```bash
VIRUSTOTAL_API_KEY=your_key_here
NODE_ENV=development
PORT=10000
FRONTEND_URL=http://localhost:3000
```

---
*For detailed documentation, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)*
