# Deployment Instructions for Phishing Detection System

This guide covers deploying the frontend on Vercel and backend on Render with local data storage.

## Prerequisites

1. GitHub repository with your code
2. Vercel account (https://vercel.com)
3. Render account (https://render.com)

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Connect Repository to Vercel:**
   - Log in to Vercel
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` folder as the root directory

2. **Configure Build Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables:**
   Add these variables in Vercel dashboard:
   ```
   REACT_APP_API_URL = https://your-render-app-name.onrender.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note down your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 2: Update API URL
After getting your Render backend URL, update the environment variable:
```
REACT_APP_API_URL = https://your-actual-render-url.onrender.com/api
```

## Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. **Create New Web Service:**
   - Log in to Render
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select repository root (not client folder)

2. **Configure Service:**
   ```
   Name: phishing-detection-api
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free (or paid if you prefer)
   ```

3. **Environment Variables:**
   Add these variables in Render dashboard:
   ```
   NODE_ENV = production
   FRONTEND_URL = https://your-vercel-app.vercel.app
   PORT = 10000
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note down your Render URL (e.g., `https://your-app-name.onrender.com`)

### Step 2: Update Frontend
After getting your Render backend URL, update the frontend environment variable in Vercel:
```
REACT_APP_API_URL = https://your-actual-render-url.onrender.com/api
```

## Local Data Storage

The system now uses local file storage instead of MongoDB:
- Analysis results are stored in `/data/analyses.json`
- No external database is required
- Data persists as long as the Render service stays running

## Testing the Deployment

1. **Test Backend:**
   ```
   GET https://your-render-app.onrender.com/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try analyzing a URL
   - Check if API calls are working

## Common Issues and Solutions

### CORS Issues
If you encounter CORS errors:
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that the frontend is using the correct API URL

### Environment Variables
- Make sure all environment variables are set correctly
- Variables in Vercel should be prefixed with `REACT_APP_`
- Restart services after changing environment variables

### Local Storage Limitations
- Render free tier has limited disk space
- Files are stored in `/data` directory
- Consider upgrading to paid plan for production use

## URLs to Update

After deployment, update these files with your actual URLs:

1. **client/src/services/phishingService.ts:**
   ```typescript
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? process.env.REACT_APP_API_URL || 'https://YOUR-RENDER-URL.onrender.com/api'
     : 'http://localhost:5000/api';
   ```

2. **render.yaml:**
   ```yaml
   - key: FRONTEND_URL
     value: https://YOUR-VERCEL-URL.vercel.app
   ```

## Future Improvements

1. Consider using a persistent database (PostgreSQL, MongoDB) for production
2. Implement user authentication
3. Add API rate limiting per user
4. Set up monitoring and logging

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend build errors
3. Verify all environment variables are set correctly
4. Test API endpoints locally first
