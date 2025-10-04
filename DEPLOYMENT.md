# 🚀 Deployment Guide

This guide will help you deploy your Phishing Detection System to production using Render (backend) and Vercel (frontend) with MongoDB Atlas.

## 📋 Prerequisites

1. **GitHub Account** - To store your code
2. **Render Account** - For backend hosting
3. **Vercel Account** - For frontend hosting
4. **MongoDB Atlas Account** - For database hosting

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### 1.2 Configure Database
1. **Create Database User:**
   - Go to Database Access
   - Add New Database User
   - Username: `phishing-detection-user`
   - Password: Generate a secure password
   - Database User Privileges: `Read and write to any database`

2. **Whitelist IP Addresses:**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (for Render)
   - Add your current IP for local development

3. **Get Connection String:**
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/phishing-detection.git
git push -u origin main
```

### 2.2 Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `phishing-detection-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render dashboard, go to Environment tab and add:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phishing-detection?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2.4 Deploy
Click "Create Web Service" and wait for deployment.

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 3.2 Deploy to Vercel
```bash
# In your project root
cd client
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: phishing-detection-frontend
# - Directory: ./client
# - Override settings? Y
# - Build Command: npm run build
# - Output Directory: build
# - Install Command: npm install
```

### 3.3 Set Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Environment Variables tab
3. Add:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
```

### 3.4 Redeploy
```bash
vercel --prod
```

## 🔗 Step 4: Connect Frontend and Backend

### 4.1 Update Backend CORS
In Render dashboard, update the environment variable:
```
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
```

### 4.2 Update Frontend API URL
In Vercel dashboard, update the environment variable:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
```

## 🧪 Step 5: Test Deployment

### 5.1 Test Backend
```bash
curl https://your-render-backend-url.onrender.com/api/health
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Try analyzing a URL
3. Check if results appear correctly

### 5.3 Test Database
1. Go to MongoDB Atlas
2. Check if data is being saved in the `analysisresults` collection

## 📊 Step 6: Monitor and Analytics

### 6.1 Backend Monitoring
- Render provides built-in logs and metrics
- Check the "Logs" tab in Render dashboard

### 6.2 Database Monitoring
- MongoDB Atlas provides real-time metrics
- Monitor connection count, operations, and storage

### 6.3 Frontend Analytics
- Vercel provides built-in analytics
- Check the "Analytics" tab in Vercel dashboard

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that the URL matches exactly (including https://)

2. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check connection string format
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check build logs in Render/Vercel
   - Ensure all dependencies are in package.json
   - Verify environment variables are set

4. **API Not Responding**
   - Check Render logs for errors
   - Verify the service is running
   - Check if environment variables are loaded

## 🚀 Production Optimizations

### Backend Optimizations:
1. **Enable HTTPS** (automatic on Render)
2. **Set up monitoring** with Render's built-in tools
3. **Configure rate limiting** (already implemented)
4. **Add request logging** for analytics

### Frontend Optimizations:
1. **Enable CDN** (automatic on Vercel)
2. **Optimize bundle size** with code splitting
3. **Add error boundaries** for better UX
4. **Implement caching** for API responses

### Database Optimizations:
1. **Create indexes** for frequently queried fields
2. **Set up monitoring** in MongoDB Atlas
3. **Configure backups** (automatic on Atlas)
4. **Monitor performance** with Atlas metrics

## 📝 Environment Variables Summary

### Backend (Render):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://your-frontend.vercel.app
PORT=5000
```

### Frontend (Vercel):
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 🎉 Success!

Your phishing detection system is now live and accessible worldwide! 

- **Frontend**: https://your-frontend.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas (managed)

The system will automatically scale and handle traffic as it grows.
