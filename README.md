# 🛡️ Phishing Detection System

A real-time web application that analyzes URLs to detect potential phishing attempts using multiple security algorithms.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for web scraping
- **Cheerio** - Server-side HTML parsing
- **WHOIS** - Domain information lookup
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiter** - Request throttling

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API communication

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Running the Application
```bash
# Start backend (Terminal 1)
npm start

# Start frontend (Terminal 2)
cd client && npm start

# Or run both simultaneously
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔍 Detection Features

### URL Analysis
- HTTPS/SSL validation
- IP address detection
- Suspicious subdomain patterns
- URL length and character analysis

### Domain Analysis
- Trusted domain verification
- Typosquatting detection (g00gle.com, faceb00k.com)
- Domain age checking via WHOIS
- Character substitution patterns

### Content Analysis
- Urgent language detection
- Form field analysis
- External script counting
- Page accessibility checks

## 🧪 Test URLs

**Safe URLs:**
- `https://google.com`
- `https://amazon.com`
- `https://github.com`

**Suspicious URLs:**
- `https://g00gle.com` (typosquatting)
- `https://faceb00k.com` (typosquatting)
- `http://example.com` (no SSL)

## 📊 API Endpoints

### POST `/api/detect`
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "isPhishing": false,
    "riskScore": 15,
    "riskLevel": "LOW",
    "recommendations": ["✅ Website appears legitimate"]
  }
}
```

### GET `/api/health`
Health check endpoint.

## 🔒 Security Features

- Rate limiting (10 requests/minute)
- Input validation
- Security headers (Helmet)
- CORS protection
- Error handling

## ⚠️ Important Notes

- **Educational purpose only** - Not a replacement for comprehensive security
- Always verify suspicious sites through official channels
- System may not detect all sophisticated phishing attempts

## 🛠️ Project Structure

```
├── src/
│   └── phishingDetector.js    # Core detection logic
├── client/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   └── types.ts          # TypeScript definitions
│   └── package.json
├── server.js                  # Express server
└── package.json
```

## 🚀 Deployment

### Quick Deploy Options

**Option 1: Full Stack Deployment**
- Backend: Deploy to [Render](https://render.com) with MongoDB Atlas
- Frontend: Deploy to [Vercel](https://vercel.com)
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

**Option 2: Local Development**
```bash
# Backend
npm install
npm start

# Frontend
cd client && npm install && npm start
```

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 📝 License

MIT License - Free to use and modify.

---

**Stay safe online! 🛡️**