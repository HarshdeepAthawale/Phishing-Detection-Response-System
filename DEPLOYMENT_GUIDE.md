# Phishing Detection System - Deployment Guide

## 🚀 Complete Deployment Instructions

This guide will help you deploy a fully functional phishing detection system with both frontend and backend components.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Node.js 18+ installed locally

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Render)
- **Storage**: Local file-based storage (can be upgraded to database later)

## 🔧 Deployment Steps

### 1. Frontend Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the React app in the `client` directory
   - The `vercel.json` configuration will handle the monorepo structure
   - Deploy and note the Vercel URL (e.g., `https://your-app.vercel.app`)

### 2. Backend Deployment (Render)

1. **Prepare Backend**:
   - Ensure `render.yaml` is configured correctly
   - Update the `FRONTEND_URL` in `render.yaml` with your Vercel URL

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Use the following settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`
   - Add environment variables:
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://your-app.vercel.app` (your Vercel URL)
     - `PORT`: `10000`
   - Deploy and note the Render URL (e.g., `https://phishing-detection-api.onrender.com`)

3. **Update Frontend API URL**:
   - Go to your Vercel project settings
   - Add environment variable:
     - `REACT_APP_API_URL`: `https://phishing-detection-api.onrender.com/api`
   - Redeploy the frontend

### 3. Alternative: Full-Stack Deployment (Vercel)

If you prefer to deploy everything on Vercel:

1. **Create API Routes**:
   - Move backend code to `api/` directory in the client folder
   - Use Vercel's serverless functions
   - Update frontend to use relative API paths

2. **Deploy**:
   - Push to GitHub
   - Vercel will handle both frontend and API routes

## 🔄 Fallback System

The system includes a smart fallback mechanism:

- **Primary**: Full backend analysis with comprehensive checks
- **Fallback**: Client-side basic analysis when backend is unavailable
- **Graceful Degradation**: Users still get security analysis even without backend

## 🧪 Testing Your Deployment

### Frontend Tests
1. Visit your Vercel URL
2. Enter a test URL (e.g., `https://google.com`)
3. Verify the analysis works
4. Check if client-side fallback works by temporarily breaking the API connection

### Backend Tests
1. Test health endpoint: `GET https://your-backend-url.onrender.com/api/health`
2. Test detection endpoint: `POST https://your-backend-url.onrender.com/api/detect`
3. Verify CORS is working with your frontend domain

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Connection Issues**:
   - Verify backend is deployed and running
   - Check CORS configuration
   - Ensure environment variables are set correctly

3. **Permission Errors**:
   - The updated build configuration should resolve these
   - If issues persist, check the `vercel.json` configuration

### Debug Steps

1. **Check Backend Logs**:
   - Go to Render dashboard
   - View service logs for errors

2. **Check Frontend Console**:
   - Open browser developer tools
   - Look for network errors or console messages

3. **Test API Directly**:
   - Use tools like Postman or curl to test backend endpoints

## 🔧 Configuration Files

### Key Files Updated:
- `vercel.json` - Frontend deployment configuration
- `client/vercel.json` - Client-specific settings
- `render.yaml` - Backend deployment configuration
- `client/src/services/phishingService.ts` - API service with fallback
- `client/src/types.ts` - TypeScript definitions

### Environment Variables:

**Frontend (Vercel)**:
- `REACT_APP_API_URL`: Backend API URL

**Backend (Render)**:
- `NODE_ENV`: production
- `FRONTEND_URL`: Frontend domain for CORS
- `PORT`: 10000

## 🚀 Production Optimizations

1. **Performance**:
   - Enable Vercel's edge caching
   - Optimize images and assets
   - Use CDN for static files

2. **Security**:
   - Implement rate limiting (already included)
   - Add request validation
   - Use HTTPS everywhere

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track usage analytics

## 📊 Features Included

✅ **Frontend**:
- Modern React + TypeScript UI
- Responsive design with Tailwind CSS
- Real-time URL validation
- Comprehensive results display
- Client-side fallback analysis

✅ **Backend**:
- Express.js API server
- Comprehensive phishing detection
- Rate limiting and security headers
- Local file storage
- Analytics endpoint

✅ **Deployment**:
- Vercel frontend deployment
- Render backend deployment
- Monorepo configuration
- Environment variable management
- Error-free build process

## 🎯 Next Steps

1. **Deploy both services** using the instructions above
2. **Test the complete system** end-to-end
3. **Monitor performance** and fix any issues
4. **Consider upgrades**:
   - Database integration (MongoDB, PostgreSQL)
   - Advanced ML-based detection
   - User authentication
   - Admin dashboard

Your phishing detection system is now ready for production use! 🎉
