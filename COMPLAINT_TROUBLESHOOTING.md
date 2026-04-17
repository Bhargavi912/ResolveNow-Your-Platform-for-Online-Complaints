# Complaint Submission Troubleshooting Guide

## Problem: Complaint Not Submitting

### Step 1: Verify You're Logged In as Customer

1. Open browser console (F12)
2. Type: `JSON.parse(localStorage.getItem('user'))`
3. Check the output:
   - ✅ Should show: `{ userType: "customer", ... }` or `{ userType: "user", ... }`
   - ❌ If `null` → Not logged in
   - ❌ If `userType: "agent"` or `"admin"` → Wrong account type

**Solution if wrong:** Logout and login with a customer/user account.

### Step 2: Check Backend Server

1. Open new browser tab
2. Go to: https://resolvenow-backend-qf06.onrender.com/api/health
3. Expected response: `{"status":"OK","message":"Server is running"}`
4. If error → Backend not running

**Solution:** Start backend server:
```powershell
cd backend
node index.js
```

### Step 3: Debug Submission

#### A. Open Browser Console (F12)

#### B. Fill the complaint form:
- Full Name: `John Doe`
- Address: `123 Main Street`
- City: `New York`
- State: `NY`
- Pincode: `123456`
- Complaint: `Test complaint`
- Photo: Optional

#### C. Click "Submit Complaint"

#### D. Watch console logs

**Expected Output (SUCCESS):**
```
=== COMPLAINT SUBMISSION START ===
Form data: {name: "John Doe", address: "123 Main Street", ...}
Token: Present
API URL: https://resolvenow-backend-qf06.onrender.com/api/complaints
Submitting complaint...
API Response: {message: "Complaint registered successfully", complaint: {...}}
Complaint submitted successfully!
Redirecting to status page...
=== COMPLAINT SUBMISSION END ===
```

### Step 4: Check Backend Terminal

While submitting, backend terminal should show:

```
=== COMPLAINT SUBMISSION (Backend) ===
User ID: 65abc123...
Request body: {name: "John Doe", address: "123 Main Street", ...}
Saving complaint to database...
Complaint saved successfully! ID: 65def456...
```

## Common Issues & Solutions

### Issue 1: "Token: Missing" in console

**Cause:** Not logged in

**Solution:**
1. Go to login page
2. Create/login with customer account
3. Try submitting again

### Issue 2: "Error 403: Access denied"

**Cause:** Logged in as admin or agent (they can't submit complaints)

**Solution:**
1. Logout
2. Create a new account with userType: "Customer/User"
3. Login with that account
4. Submit complaint

### Issue 3: "Error 400: Missing required fields"

**Cause:** Some form fields are empty

**Solution:**
Fill ALL required fields:
- Name ✓
- Address ✓
- City ✓
- State ✓
- Pincode (6 digits) ✓
- Complaint Description ✓
- Photo (optional)

### Issue 4: "Network Error" or "ERR_CONNECTION_REFUSED"

**Cause:** Backend server not running

**Solution:**
```powershell
cd backend
node index.js
```

Should see: "Server running on port 5000"

### Issue 5: Button does nothing (no console logs)

**Cause:** JavaScript not loading or form validation failing

**Solution:**
1. Hard refresh: Ctrl + Shift + R
2. Check console for errors
3. Verify all required fields are filled
4. Check pincode is exactly 6 digits

### Issue 6: "Failed to submit complaint" error

**Cause:** Backend error (database issue)

**Solution:**
1. Check backend terminal for error messages
2. Verify MongoDB is running
3. Check database connection in config.js

### Issue 7: Submission successful but complaint not appearing

**Cause:** Different user viewing complaints

**Solution:**
1. Stay logged in with SAME user who submitted
2. Go to "My Complaints" / "Status" page
3. Should see your complaint there

### Issue 8: Photo upload failing

**Cause:** File too large or wrong format

**Solution:**
- Image must be under 5MB
- Format: JPG, PNG, GIF
- Try without photo first
- Make photo optional

## Test Checklist

Before submitting complaint:

- [ ] Backend server running (check http://localhost:5000/api/health)
- [ ] Frontend running (http://localhost:3000 accessible)
- [ ] Logged in as CUSTOMER/USER (not admin/agent)
- [ ] Browser console open (F12)
- [ ] All required fields filled
- [ ] Pincode is 6 digits
- [ ] Photo under 5MB (if uploading)

## Quick Test

Run this in browser console AFTER logging in:

```javascript
// Check login status
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

console.log('User:', user);
console.log('User Type:', user?.userType);
console.log('Token:', token ? 'Present' : 'Missing');

// If all good, should show:
// User: {name: "...", email: "...", userType: "customer"}
// Token: Present
```

## Manual API Test

To test if API works directly:

```javascript
const token = localStorage.getItem('token');

fetch('https://resolvenow-backend-qf06.onrender.com/api/complaints', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Test User',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    comment: 'This is a test complaint',
    photo: ''
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

Expected response:
```json
{
  "message": "Complaint registered successfully",
  "complaint": {
    "_id": "...",
    "userId": "...",
    "name": "Test User",
    "address": "123 Test St",
    "city": "Test City",
    "state": "Test State",
    "pincode": "123456",
    "comment": "This is a test complaint",
    "status": "pending",
    "createdAt": "..."
  }
}
```

## Still Not Working?

Report these details:

1. **Browser Console Output:** Copy entire console log
2. **Backend Terminal Output:** Copy what backend shows
3. **User Type:** What does `localStorage.getItem('user')` show?
4. **Error Message:** Exact error text
5. **What Happens:** Does button click do anything? Does page freeze?

## Database Check

If you have MongoDB access:

```javascript
// In MongoDB shell or Compass
use resolvenow

// Check if complaints collection exists
db.getCollectionNames()

// Check existing complaints
db.complaints.find().pretty()

// Check users
db.users.find().pretty()
```
