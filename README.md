# Phishing Detection and Response System

A production-ready web application that detects and analyzes potentially malicious websites using multi-layer security analysis.

## Features

- **Real-time URL Analysis** with comprehensive risk assessment
- **Multi-layer Detection**: URL structure, domain analysis, content scanning, SSL validation, and VirusTotal threat intelligence
- **Risk Scoring** with detailed breakdowns and actionable recommendations
- **Modern UI** with responsive design and real-time validation
- **Fallback System** for client-side analysis when backend is unavailable

## Tech Stack

**Frontend**: React 18 + TypeScript + Tailwind CSS (Deployed on Vercel)  
**Backend**: Node.js + Express + Cheerio + VirusTotal API (Deployed on Render)

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation
```bash
git clone <repository-url>
cd phishing-detection-system
npm run install-all
cp config/.env.example config/.env
# Edit config/.env with your API keys
npm run dev
```

**Access**: Frontend at http://localhost:3000, Backend API at http://localhost:10000

## Scripts

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build frontend for production
npm run install-all      # Install all dependencies
npm test                 # Run all tests
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/detect` - URL analysis
- `GET /api/analytics` - Analytics data

## Risk Levels

- **LOW** (0-19 points): Safe to visit
- **LOW-MEDIUM** (20-39 points): Proceed with caution
- **MEDIUM** (40-69 points): Suspicious characteristics
- **HIGH** (70+ points): Likely phishing

## Analysis Features

- **URL Structure**: Protocol validation, IP detection, suspicious patterns
- **Domain Analysis**: Trusted domains, typosquatting detection, WHOIS data
- **Content Analysis**: Web page accessibility, suspicious content patterns
- **SSL Security**: Certificate validation, encryption strength

## Security

- Rate limiting and CORS protection
- Input validation and security headers
- Graceful error handling

## Security Notice

This tool is for educational purposes. Always exercise caution when visiting unknown websites and never enter sensitive information on suspicious sites.

---

**Ready to use!** The system is fully deployed and functional.