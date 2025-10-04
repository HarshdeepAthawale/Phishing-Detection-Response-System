# 🔧 Backend Setup Guide - Fix Connection Issues

## 🚨 Current Issue

Your frontend is deployed successfully on Vercel, but it cannot connect to the backend because:

1. **Backend not deployed**: The URL `https://phishing-detection-api.onrender.com/api` is not accessible
2. **Environment variable not set**: The frontend needs the correct API URL

## ✅ Immediate Solution (Client-Side Analysis)

The application now includes an **enhanced client-side analysis** that works without a backend! It can detect:

- ✅ HTTP vs HTTPS usage
- ✅ Suspicious URL patterns
- ✅ Typosquatting attempts
- ✅ IP addresses instead of domains
- ✅ Invalid URL formats
- ✅ Suspicious subdomains

## 🚀 Fix Options

### Option 1: Deploy Your Backend (Recommended)

**Step 1: Deploy Backend to Render**
1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Name**: `phishing-detection-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

**Step 2: Set Environment Variables in Render**
```
NODE_ENV=production
FRONTEND_URL=https://phishing-detection-response-system.vercel.app
PORT=10000
```

**Step 3: Update Vercel Environment Variables**
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add: `REACT_APP_API_URL` = `https://your-actual-render-url.onrender.com/api`
4. Redeploy your frontend

### Option 2: Use Different Backend Service

**Railway (Alternative to Render)**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend
4. Update the API URL in Vercel

**Heroku (Alternative)**
1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Connect GitHub and deploy
4. Update the API URL in Vercel

### Option 3: Full Vercel Deployment (Serverless)

Convert your backend to use Vercel serverless functions:

1. Move `server.js` logic to `api/` directory
2. Create individual API endpoints as serverless functions
3. Deploy everything on Vercel

## 🧪 Test Your Setup

### Test Backend Health:
```bash
# Replace with your actual backend URL
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Phishing Detection API is running"
}
```

### Test Frontend Connection:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Enter a URL in your frontend
4. Check console logs for connection status

## 🔍 Debug Steps

### Check Frontend Console:
The updated code now logs detailed information:
- 🔍 Starting URL analysis
- 🌐 API Base URL being used
- ❌ Any connection errors
- 🔄 Fallback to client-side analysis

### Check Network Tab:
1. Open developer tools
2. Go to Network tab
3. Try analyzing a URL
4. Look for failed requests to your backend

## 🎯 Current Status

**✅ Working Now:**
- Frontend is deployed and accessible
- Client-side phishing detection is working
- Basic security analysis is functional
- Users can analyze URLs and get results

**❌ Needs Backend:**
- For comprehensive analysis
- For storing analysis history
- For advanced security checks
- For analytics and reporting

## 🚀 Quick Start

**For immediate use**, try these URLs in your frontend:

**Safe URLs (should show LOW risk):**
- `https://google.com`
- `https://github.com`
- `https://stackoverflow.com`

**Suspicious URLs (should show warnings):**
- `http://fakebank.com` (HTTP instead of HTTPS)
- `https://googIe.com` (typosquatting)
- `https://192.168.1.1` (IP address)
- `https://secure-banking-login.com` (suspicious subdomain)

## 🎉 Success!

Your phishing detection system is **working right now** with client-side analysis! Once you deploy a backend, you'll get even more comprehensive security analysis.

## 📞 Need Help?

1. **Check browser console** for detailed error messages
2. **Verify backend URL** is accessible
3. **Test API endpoint** manually
4. **Update environment variables** in Vercel
5. **Redeploy frontend** after changes

The system is designed to be resilient - it works with or without a backend! 🛡️
