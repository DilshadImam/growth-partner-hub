# Deployment Guide for Netlify

## Environment Variables Setup

### Step 1: Update .env file
Before deploying to Netlify, update your `.env` file with your production backend URL:

```env
VITE_API_URL=https://your-backend-url.com
```

**Important:** Do NOT include `/api` at the end. The application will automatically append it.

### Step 2: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com` (your deployed backend URL)

### Step 3: Build Settings

Make sure your Netlify build settings are:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** `frontend` (if deploying from monorepo)

### Step 4: Deploy

Push your code to your Git repository, and Netlify will automatically build and deploy.

## Local Development

For local development, use:
```env
VITE_API_URL=http://localhost:5000
```

## How It Works

The application uses Vite's environment variables:
- `VITE_API_URL` - Base backend URL (e.g., `http://localhost:5000`)
- The app automatically appends `/api` for API calls

All API calls in the application use:
- `API_URL` - Base URL without `/api` (e.g., `http://localhost:5000`)
- `API_BASE_URL` - Full API URL with `/api` (e.g., `http://localhost:5000/api`)

## Troubleshooting

If API calls are not working after deployment:
1. Check Netlify environment variables are set correctly
2. Verify your backend URL is accessible
3. Check browser console for CORS errors
4. Ensure backend allows requests from your Netlify domain
