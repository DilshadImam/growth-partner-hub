# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- MongoDB Atlas account (for database)
- GitHub repository

## Step 1: Prepare Your Backend

Your backend is already configured for Railway with:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process file for Railway
- ✅ `.env.example` - Environment variables template

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Railway configuration"
   git push origin main
   ```

2. **Create New Project on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - **IMPORTANT**: In Settings → Service Settings → Root Directory, set it to `backend`
   - Railway will automatically detect and deploy

3. **Configure Environment Variables**
   In Railway dashboard, go to Variables tab and add:

   **Required Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app.netlify.app
   ```

   **Email Configuration (Required for contact forms):**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=noreply@yourdomain.com
   BUSINESS_EMAIL=your-business@gmail.com
   ```

   **Cloudinary (Required for image uploads):**
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Optional Services:**
   ```
   STRIPE_SECRET_KEY=sk_test_xxx (if using payments)
   TWILIO_ACCOUNT_SID=xxx (if using SMS/WhatsApp)
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Option B: Deploy using Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize and Deploy**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your-connection-string
   # Add other variables...
   ```

## Step 3: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name

3. **Whitelist Railway IP**
   - In MongoDB Atlas, go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Railway's specific IPs

## Step 4: Get Your Railway Backend URL

After deployment:
1. Go to your Railway project
2. Click on "Settings" tab
3. Find "Domains" section
4. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

## Step 5: Update Frontend Environment Variable

Update your Netlify frontend environment variable:
```
VITE_API_URL=https://your-app.up.railway.app
```

## Step 6: Seed Admin User (Optional)

After deployment, you can seed an admin user:

1. **Using Railway CLI:**
   ```bash
   railway run npm run seed:admin
   ```

2. **Or connect to Railway shell:**
   - In Railway dashboard, click on your service
   - Go to "Settings" → "Deploy"
   - Use the shell to run: `npm run seed:admin`

## Troubleshooting

### "Cannot find module 'express'" Error

This happens when Railway tries to run from the wrong directory. Fix:

1. **Go to Railway Dashboard**
2. **Click on your service**
3. **Go to Settings tab**
4. **Scroll to "Service Settings"**
5. **Find "Root Directory"**
6. **Set it to:** `backend`
7. **Click "Redeploy"**

Railway will now:
- Install dependencies from `backend/package.json`
- Run `npm start` from the `backend` folder
- Find all your backend files correctly

### Build Fails
- Check Railway logs in the dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify MongoDB connection string
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

### CORS Errors
- Verify `FRONTEND_URL` environment variable
- Check that it matches your Netlify URL exactly
- Include protocol (https://)

### Email Not Working
- Verify Gmail app password (not regular password)
- Enable "Less secure app access" or use App Password
- Check EMAIL_* environment variables

## Monitoring

Railway provides:
- **Logs**: View real-time logs in dashboard
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Track deployment history

## Custom Domain (Optional)

1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `FRONTEND_URL` in Netlify to match

## Cost

Railway offers:
- **Free Tier**: $5 credit per month
- **Pro Plan**: $20/month for more resources
- Pay only for what you use

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MongoDB Atlas Support: https://www.mongodb.com/support
