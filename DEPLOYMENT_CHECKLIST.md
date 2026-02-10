# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Changes
- [x] Created `netlify.toml` with `base = "frontend"`
- [x] Updated `config.ts` to handle trailing slashes
- [x] Updated `.env` and `.env.example` files
- [x] Created deployment documentation

### Git
- [ ] Commit all changes
- [ ] Push to GitHub main branch

## ✅ Netlify Configuration

### Environment Variables
- [ ] Go to: Site settings → Environment variables
- [ ] Set `VITE_API_URL` = `https://growth-partner-hub-production.up.railway.app`
  - ⚠️ NO trailing slash
  - ⚠️ NO /api suffix

### Build Settings
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

### Deploy
- [ ] Trigger deploy → Clear cache and deploy site
- [ ] Wait for build to complete
- [ ] Check build logs for errors

## ✅ Railway Configuration

### Environment Variables
- [ ] Go to: Variables tab
- [ ] Set `FRONTEND_URL` = `https://growthloom.netlify.app`
  - ⚠️ NO trailing slash
- [ ] Verify `NODE_ENV` = `production`
- [ ] Verify `MONGODB_URI` is set
- [ ] Verify `JWT_SECRET` is set
- [ ] Verify email variables are set (if using email)
- [ ] Verify Cloudinary variables are set (if using uploads)

### Service Settings
- [ ] Root Directory: `backend`
- [ ] Build Command: (leave empty, uses package.json)
- [ ] Start Command: `npm start`

### Deploy
- [ ] Wait for auto-redeploy after variable changes
- [ ] Or manually click "Redeploy"
- [ ] Check logs for successful startup

## ✅ Verification

### Backend Health Check
- [ ] Visit: `https://growth-partner-hub-production.up.railway.app/health`
- [ ] Should return: `{"status":"OK",...}`

### Frontend Loading
- [ ] Visit: `https://growthloom.netlify.app`
- [ ] Homepage loads without errors
- [ ] Open browser console (F12)
- [ ] No 404 errors in console
- [ ] No CORS errors in console

### API Calls
Check Network tab in browser console:
- [ ] API calls go to: `https://growth-partner-hub-production.up.railway.app/api/...`
- [ ] No double slashes: `//api/...`
- [ ] Status codes are 200 (not 404)
- [ ] Data loads correctly

### Functionality Tests
- [ ] Homepage shows stats, testimonials, companies
- [ ] Navigation works (all pages load)
- [ ] Contact form submits successfully
- [ ] Login/Register works
- [ ] Admin dashboard accessible (after login)
- [ ] Image uploads work (if using Cloudinary)

## ✅ Post-Deployment

### Monitoring
- [ ] Check Railway logs for errors
- [ ] Check Netlify logs for errors
- [ ] Monitor API response times
- [ ] Check database connections

### Optional
- [ ] Set up custom domain on Netlify
- [ ] Set up custom domain on Railway
- [ ] Configure SSL certificates
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy

## 🚨 Common Issues

### Issue: Double slashes in API URLs
**Fix**: Remove trailing slash from `VITE_API_URL` in Netlify

### Issue: CORS errors
**Fix**: Update `FRONTEND_URL` in Railway to match Netlify URL exactly

### Issue: 404 on page refresh
**Fix**: Verify `netlify.toml` has redirects configured

### Issue: Environment variables not working
**Fix**: Redeploy after changing variables, clear cache

### Issue: Build fails on Netlify
**Fix**: Check base directory is set to `frontend`

### Issue: Backend not starting on Railway
**Fix**: Check Root Directory is set to `backend`

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas

## 🎉 Success Criteria

Your deployment is successful when:
1. ✅ Frontend loads at https://growthloom.netlify.app
2. ✅ Backend responds at https://growth-partner-hub-production.up.railway.app/health
3. ✅ No console errors (404, CORS, etc.)
4. ✅ All pages load and navigate correctly
5. ✅ API calls return data successfully
6. ✅ Forms submit without errors
7. ✅ Login/authentication works
