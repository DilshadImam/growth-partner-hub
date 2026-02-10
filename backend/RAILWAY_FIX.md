# 🔧 Railway Deployment Fix

## Error: "Cannot find module 'express'"

### Problem
Railway is trying to run from the root directory instead of the `backend` folder.

### Solution (2 minutes)

#### Step 1: Set Root Directory
1. Open your Railway project dashboard
2. Click on your backend service
3. Go to **Settings** tab
4. Scroll down to **"Service Settings"** section
5. Find **"Root Directory"** field
6. Enter: `backend`
7. Click **Save** or it will auto-save

#### Step 2: Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
   OR
3. Push a new commit to trigger automatic deployment

### Verification

After redeployment, check the logs. You should see:
```
✅ Installing dependencies from backend/package.json
✅ Running npm start from backend directory
✅ 🚀 Digital Growth Platform API running on port 5000
```

### Alternative: Deploy Only Backend Folder

If you want to deploy only the backend folder:

1. **Create a separate repository** for backend only
2. Copy everything from `backend/` folder to the new repo root
3. Deploy the new repo to Railway
4. No need to set Root Directory

### Still Having Issues?

Check these:
1. ✅ `backend/package.json` exists
2. ✅ `backend/src/server.js` exists
3. ✅ All environment variables are set in Railway
4. ✅ MongoDB connection string is correct
5. ✅ Root Directory is set to `backend`

### Quick Test Locally

Before deploying, test locally:
```bash
cd backend
npm install
npm start
```

If this works locally, it will work on Railway with correct Root Directory setting.
