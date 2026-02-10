# Deployment Fix Guide

## Current Issues

1. **Double slash in API URLs**: `//api/hero/stats` instead of `/api/hero/stats`
2. **CORS blocked**: Backend doesn't allow `https://growthloom.netlify.app`

## Root Causes

1. **Netlify Environment Variable**: `VITE_API_URL` has a trailing slash
2. **Railway Environment Variable**: `FRONTEND_URL` is set to local development URL

## Complete Fix Steps

### Step 1: Fix Netlify Environment Variable

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Select your site**: growthloom
3. **Go to**: Site settings → Environment variables
4. **Find**: `VITE_API_URL`
5. **Update to**: `https://growth-partner-hub-production.up.railway.app`
   - ⚠️ **NO trailing slash!**
   - ⚠️ **NO /api at the end!**

### Step 2: Fix Railway Environment Variable

1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**: growth-partner-hub-production
3. **Go to**: Variables tab
4. **Find or Add**: `FRONTEND_URL`
5. **Set to**: `https://growthloom.netlify.app`
   - ⚠️ **NO trailing slash!**

### Step 3: Verify Other Railway Variables

Make sure these are set correctly:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://dilshadimam:DilshadImam@cluster0.kmnyus6.mongodb.net/growth-partner-hub?retryWrites=true&w=majority
JWT_SECRET=kalluepstinefilenamehai
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://growthloom.netlify.app

# Email (already configured)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dilshadimam21@gmail.com
EMAIL_PASS=wosglrpjroesbpkm
EMAIL_FROM=dilshadimam21@gmail.com
BUSINESS_EMAIL=dilshadimam21@gmail.com

# Cloudinary (already configured)
CLOUDINARY_CLOUD_NAME=dg5zqycs0
CLOUDINARY_API_KEY=724647998929931
CLOUDINARY_API_SECRET=uwZ_BiVG0sf8urpkIqfcTKZbU6w
```

### Step 4: Redeploy Both Services

**Railway (Backend):**
1. After updating `FRONTEND_URL`, Railway will auto-redeploy
2. Or manually click "Redeploy" in Railway dashboard
3. Wait for deployment to complete

**Netlify (Frontend):**
1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for build to complete

### Step 5: Verify Deployment

1. **Open your site**: https://growthloom.netlify.app
2. **Open browser console** (F12)
3. **Check Network tab**:
   - API calls should go to: `https://growth-partner-hub-production.up.railway.app/api/...`
   - Should return 200 status (not 404)
   - No CORS errors

4. **Test functionality**:
   - Homepage loads with stats, testimonials, companies
   - Contact form works
   - Login/Register works
   - All pages load correctly

## Expected API URLs

After fix, all API calls should look like:
```
✅ https://growth-partner-hub-production.up.railway.app/api/hero/stats
✅ https://growth-partner-hub-production.up.railway.app/api/testimonials
✅ https://growth-partner-hub-production.up.railway.app/api/companies
✅ https://growth-partner-hub-production.up.railway.app/api/services
```

NOT:
```
❌ https://growth-partner-hub-production.up.railway.app//api/hero/stats (double slash)
❌ //api/hero/stats (missing domain)
```

## Troubleshooting

### Still seeing double slashes?

1. **Clear Netlify cache**: Trigger deploy → Clear cache and deploy site
2. **Check environment variable**: Make sure no trailing slash in `VITE_API_URL`
3. **Hard refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Still getting CORS errors?

1. **Verify Railway `FRONTEND_URL`**: Must be exactly `https://growthloom.netlify.app`
2. **Check Railway logs**: Look for CORS-related errors
3. **Restart Railway service**: Click "Redeploy" in Railway dashboard

### API returns 404?

1. **Check Railway is running**: Visit `https://growth-partner-hub-production.up.railway.app/health`
2. **Should return**: `{"status":"OK","message":"Digital Growth Platform API is running",...}`
3. **If not running**: Check Railway logs for errors

### Environment variable not updating?

1. **Netlify**: Must redeploy after changing variables
2. **Railway**: Auto-redeploys, but can take 1-2 minutes
3. **Clear browser cache**: Hard refresh after redeployment

## Quick Verification Commands

**Test backend health:**
```bash
curl https://growth-partner-hub-production.up.railway.app/health
```

**Test API endpoint:**
```bash
curl https://growth-partner-hub-production.up.railway.app/api/hero/stats
```

**Check CORS:**
```bash
curl -H "Origin: https://growthloom.netlify.app" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  https://growth-partner-hub-production.up.railway.app/api/hero/stats
```

## Summary

The fix requires updating two environment variables:

1. **Netlify**: `VITE_API_URL=https://growth-partner-hub-production.up.railway.app`
2. **Railway**: `FRONTEND_URL=https://growthloom.netlify.app`

Both without trailing slashes, then redeploy both services.
