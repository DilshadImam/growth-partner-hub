# Showcase Link Feature - Complete Implementation

## Summary
Added link functionality to showcase images so users can click on images to visit external URLs.

## Changes Made

### 1. Backend - Database Model
**File:** `backend/src/models/ShowcaseImage.js`
- Added `link` field (String, optional, default: '')

### 2. Backend - API Routes
**File:** `backend/src/routes/showcase.js`

**POST /api/showcase:**
- Accepts `link` from request body
- Saves link to database

**PUT /api/showcase/:id:**
- Accepts `link` from request body  
- Updates link in database

**GET /api/showcase:**
- Returns link field with image data

### 3. Frontend - Admin Panel
**File:** `frontend/src/pages/Admin.tsx`

**State:**
- `newImage` includes `link` field
- `editingImage` includes `link` field

**Add Image Form:**
- Link input field added
- Sends link via FormData

**Edit Image Form:**
- Link input field added (pre-populated)
- Updates link via FormData

**Showcase Listing:**
- Displays link with 🔗 icon in blue color

### 4. Frontend - Display
**File:** `frontend/src/components/sections/FocusBanner.tsx`

- "Visit Link" button on top-right of each image
- Black background, white text
- Opens link in new tab
- Hover effects and animations

## Testing Steps

1. **Add New Image with Link:**
   - Go to Admin Panel → Showcase tab
   - Click "Add Image"
   - Fill title, select image, add link (e.g., https://google.com)
   - Click "Upload & Save"
   - Check listing - link should show in blue

2. **Edit Existing Image Link:**
   - Click Edit button on any image
   - Update link field
   - Click "Update Image"
   - Check listing - updated link should show

3. **View on Homepage:**
   - Go to homepage
   - Scroll to showcase section
   - See "Visit Link" button on image
   - Click button - should open link in new tab

## Debugging

If link not updating:

1. **Check Browser Console:**
   ```
   Sending image with data: { title, link, hasFile }
   Updating image with: { id, title, link, hasFile }
   ```

2. **Check Backend Terminal:**
   ```
   POST /api/showcase - Request body: { title, link }
   PUT /api/showcase/:id - Request body: { title, link }
   ```

3. **Check Network Tab:**
   - Look for showcase API calls
   - Check FormData payload
   - Verify link field is present

## Common Issues

**Issue:** Link not saving to DB
**Solution:** Backend needs restart after model change

**Issue:** Link not showing in admin
**Solution:** Hard refresh browser (Ctrl+Shift+R)

**Issue:** Old images don't have link
**Solution:** Run update script: `node backend/src/scripts/updateShowcaseLinks.js`

## Files Modified

1. `backend/src/models/ShowcaseImage.js` - Added link field
2. `backend/src/routes/showcase.js` - Handle link in POST/PUT
3. `frontend/src/pages/Admin.tsx` - Add/Edit forms with link
4. `frontend/src/components/sections/FocusBanner.tsx` - Display link button
5. `backend/src/scripts/updateShowcaseLinks.js` - Migration script

## API Endpoints

**POST /api/showcase**
```
FormData:
- title: string
- image: file
- link: string (optional)
```

**PUT /api/showcase/:id**
```
FormData:
- title: string
- link: string (optional)
- image: file (optional)
```

**GET /api/showcase**
```
Response:
{
  success: true,
  data: [{
    _id, title, imageUrl, link, order, isActive, createdAt, updatedAt
  }]
}
```
