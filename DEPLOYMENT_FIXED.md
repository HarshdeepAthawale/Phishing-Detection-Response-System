# 🚀 Fixed Deployment Guide - Phishing Detection System

This guide provides the corrected deployment instructions for your Phishing Detection System with all deployment issues resolved.

## ✅ Issues Fixed

1. **Port Configuration**: Fixed port mismatch between server.js and render.yaml
2. **Build Commands**: Corrected Vercel build configuration
3. **CORS Settings**: Fixed CORS regex patterns for proper domain matching
4. **Environment Variables**: Updated environment variable handling
5. **Storage Paths**: Fixed local storage to use /tmp in production
6. **Node.js Version**: Added proper engine specifications

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Node.js 18+ installed locally
- Git installed and configured

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Render)
- **Storage**: Local file-based storage (production uses /tmp directory)

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
./deploy.sh
```

### Option 2: Manual Deployment

## 🔧 Step 1: Prepare Your Code

1. **Install Dependencies:**
```bash
npm run install-all
```

2. **Test Build:**
```bash
npm run build
```

3. **Commit Changes:**
```bash
git add .
git commit -m "Fix deployment issues"
git push origin main
```

## 🌐 Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure the project:**
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`

4. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://phishing-detection-api.onrender.com/api` (update after backend deployment)

5. **Deploy and note your Vercel URL**

## 🖥️ Step 3: Deploy Backend to Render

1. **Go to [render.com](https://render.com)**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `phishing-detection-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-url.vercel.app
   PORT=10000
   ```

6. **Deploy and note your Render URL**

## 🔗 Step 4: Connect Frontend and Backend

### Update Frontend API URL:
1. Go to your Vercel project settings
2. Update environment variable:
   - `REACT_APP_API_URL`: `https://your-render-url.onrender.com/api`
3. Redeploy the frontend

### Update Backend CORS:
1. Go to your Render dashboard
2. Update environment variable:
   - `FRONTEND_URL`: `https://your-vercel-url.vercel.app`
3. Redeploy the backend

## 🧪 Step 5: Test Your Deployment

### Test Backend:
```bash
curl https://your-render-url.onrender.com/api/health
```

### Test Frontend:
1. Visit your Vercel URL
2. Enter a test URL (e.g., `https://google.com`)
3. Verify the analysis works

## 🔧 Configuration Files Updated

### Key Files Fixed:
- ✅ `vercel.json` - Fixed build configuration
- ✅ `client/vercel.json` - Corrected build command
- ✅ `render.yaml` - Added region specification
- ✅ `server.js` - Fixed port and CORS configuration
- ✅ `client/src/services/phishingService.ts` - Updated API URL
- ✅ `src/config/localStorage.js` - Fixed storage paths for production
- ✅ `package.json` - Added Node.js engine requirements

### Environment Variables:

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Backend (Render):**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PORT=10000
```

## 🛠️ Troubleshooting

### Common Issues Fixed:

1. **Build Failures**: ✅ Fixed build command in vercel.json
2. **CORS Errors**: ✅ Fixed CORS regex patterns
3. **Port Conflicts**: ✅ Standardized on port 10000
4. **Storage Issues**: ✅ Fixed production storage paths
5. **Environment Variables**: ✅ Proper variable handling

### Debug Steps:

1. **Check Build Logs**: Look at Vercel/Render build logs
2. **Test API Directly**: Use curl or Postman to test endpoints
3. **Check Environment Variables**: Verify all variables are set correctly
4. **Monitor Logs**: Check both Vercel and Render logs for errors

## 🚀 Production URLs

After successful deployment, your system will be available at:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.onrender.com`
- **Health Check**: `https://your-api.onrender.com/api/health`

## 🎯 Next Steps

1. **Monitor Performance**: Use Vercel and Render analytics
2. **Set up Monitoring**: Consider adding error tracking (Sentry)
3. **Scale Up**: Upgrade to paid plans as traffic grows
4. **Add Features**: Consider adding user authentication, admin dashboard

## 🎉 Success!

Your phishing detection system is now deployed and ready for production use! The system includes:

- ✅ Modern React frontend with TypeScript
- ✅ Secure Express.js backend with rate limiting
- ✅ Comprehensive phishing detection algorithms
- ✅ Client-side fallback for reliability
- ✅ Proper CORS and security headers
- ✅ Production-optimized configuration

All deployment issues have been resolved! 🚀
