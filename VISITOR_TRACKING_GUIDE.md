# Visitor Tracking & Registration System

## Features Implemented:

### 1. Register Page (`/register`)
- **Fields**: Name, Email, Phone, Password
- **Features**:
  - Form validation
  - Toast notifications
  - Auto-redirect after registration
  - Saves to both Users and Leads collections
  - Beautiful UI with icons

### 2. Automatic Visitor Tracking
- **Triggers**: When anyone visits the website
- **Tracked Data**:
  - Timestamp
  - User Agent (browser/device info)
  - Language
  - Screen Resolution
  - Referrer (where they came from)
  - Current Page
- **Storage**: Saved as anonymous leads in database
- **Session**: Only tracks once per session

### 3. Admin Lead Management
- All registered users appear in Leads section
- All anonymous visitors appear in Leads section
- Can view, filter, and manage all leads

## How It Works:

### Registration Flow:
```
1. User visits /register
2. Fills form (name, email, phone, password)
3. Submits form
4. Backend creates User account
5. Backend also creates Lead entry
6. User gets logged in automatically
7. Redirects to homepage
```

### Visitor Tracking Flow:
```
1. User visits website (any page)
2. VisitorTracker component loads
3. Waits 2 seconds
4. Checks if already tracked (sessionStorage)
5. If not tracked:
   - Collects visitor info
   - Sends to backend API
   - Creates anonymous Lead entry
   - Marks as tracked for session
```

## API Endpoints:

### Register Visitor
```
POST /api/auth/register-visitor
Body: {
  name: string,
  email: string,
  phone: string,
  password: string
}
```

### Track Visitor
```
POST /api/analytics/track-visitor
Body: {
  timestamp: string,
  userAgent: string,
  language: string,
  screenResolution: string,
  referrer: string,
  currentPage: string
}
```

## Lead Types in Admin:

1. **Registered Users**:
   - Name: Actual name
   - Email: Actual email
   - Source: "Website Registration"
   - Status: "New"
   - Priority: "Medium"
   - Score: 50

2. **Anonymous Visitors**:
   - Name: "Anonymous Visitor"
   - Email: `visitor_[timestamp]@tracked.com`
   - Source: "Direct Visit" or "Referral: [url]"
   - Status: "New"
   - Priority: "Low"
   - Score: 20
   - Message: Contains browser/device info

## Usage:

### For Users:
1. Visit website
2. Click "Login" → "Register here"
3. Fill registration form
4. Submit
5. Auto-logged in and redirected

### For Admin:
1. Login to admin panel
2. Go to "Leads" section
3. See all registered users and visitors
4. Filter by status, search, etc.
5. View detailed information

## Privacy Note:
- Anonymous tracking only collects technical data
- No personal information without consent
- Session-based (not persistent across browser sessions)
- Compliant with basic privacy standards

## Files Modified/Created:

### Frontend:
- ✅ `pages/Register.tsx` (new)
- ✅ `components/VisitorTracker.tsx` (new)
- ✅ `pages/Index.tsx` (added tracker)
- ✅ `pages/Login.tsx` (added register link)
- ✅ `App.tsx` (added register route)

### Backend:
- ✅ `routes/auth.js` (added register-visitor endpoint)
- ✅ `routes/analytics.js` (added track-visitor endpoint)

## Testing:

1. **Test Registration**:
   - Go to http://localhost:8080/register
   - Fill form and submit
   - Check admin leads section

2. **Test Visitor Tracking**:
   - Open incognito window
   - Visit http://localhost:8080
   - Wait 2 seconds
   - Check admin leads section
   - Should see "Anonymous Visitor" entry

## Next Steps (Optional Enhancements):

1. Add email verification
2. Add password reset
3. Add more visitor analytics (time on page, clicks, etc.)
4. Add visitor journey tracking
5. Add conversion tracking
6. Add A/B testing capabilities
