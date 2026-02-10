# Netlify Deployment Troubleshooting

## Issue: 404 Error and MIME Type Error

### Problem
- "Failed to load resource: the server responded with a status of 404"
- "Expected a JavaScript module script but the server responded with a MIME type of 'application/octet-stream'"

### Root Cause
This happens when Netlify can't find the built files, usually due to incorrect base directory configuration in a monorepo structure.

### Solution

#### Step 1: Verify netlify.toml Configuration
The `netlify.toml` file should have `base = "frontend"` uncommented:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  base = "frontend"  # This line must be present!
```

#### Step 2: Update Netlify Dashboard Settings

1. **Go to Netlify Dashboard**
2. **Click on your site**
3. **Go to Site settings → Build & deploy → Build settings**
4. **Verify the following:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` OR just `dist` (Netlify will combine with base)

#### Step 3: Clear Cache and Redeploy

1. **Go to Deploys tab**
2. **Click "Trigger deploy"**
3. **Select "Clear cache and deploy site"**
4. **Wait for build to complete**

#### Step 4: Verify Build Output

In the Netlify build logs, you should see:
```
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

And the build should:
1. Navigate to `frontend` folder
2. Run `npm install`
3. Run `npm run build`
4. Create `dist` folder with index.html and assets

### Alternative: Deploy Only Frontend Folder

If the above doesn't work, you can deploy only the frontend folder:

#### Option A: Create Separate Repository
1. Create a new repository for just the frontend
2. Copy `frontend/*` contents to root
3. Deploy from this new repository

#### Option B: Use Netlify CLI from Frontend Folder
```bash
cd frontend
netlify deploy --prod
```

### Verification Checklist

After deployment, verify:
- [ ] Site loads without 404 errors
- [ ] JavaScript files load with correct MIME type
- [ ] Browser console shows no module loading errors
- [ ] All routes work (home, about, services, etc.)
- [ ] API calls work (check Network tab)

### Environment Variables

Don't forget to set in Netlify dashboard:
```
VITE_API_URL=https://your-railway-backend.up.railway.app
```

Then redeploy after adding the variable.

### Still Having Issues?

1. **Check Build Logs**: Look for any errors during `npm run build`
2. **Test Locally**: Run `npm run build` and `npm run preview` locally
3. **Verify File Structure**: Ensure `dist` folder contains `index.html` and `assets` folder
4. **Check Node Version**: Netlify uses Node 18 (specified in netlify.toml)

### Contact Support

If issues persist:
- Netlify Support: https://www.netlify.com/support
- Share build logs and error messages
- Mention you're deploying from a monorepo structure
