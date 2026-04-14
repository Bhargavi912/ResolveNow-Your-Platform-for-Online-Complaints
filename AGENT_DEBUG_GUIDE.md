# Agent Dashboard Debug Guide

## Step-by-Step Debugging Process

### Step 1: Verify Agent Login
1. Go to http://localhost:3000
2. Login as an agent account
3. Check that you're redirected to `/agent-dashboard`

### Step 2: Open Browser Console
1. Press **F12** to open Developer Tools
2. Click on **Console** tab
3. Keep it open

### Step 3: Check Console Logs
Look for these console messages when the page loads:

```
Fetching assignments for agent...
Token: Present
API URL: http://localhost:5000/api/complaints/assigned/agent
API Response: { assignments: [...] }
Assignments received: [...]
Number of assignments: X
```

### Step 4: Check What You See

**If you see "Loading assignments..."**
- The API call hasn't completed yet
- Wait a few seconds

**If you see "Failed to load assigned complaints"**
- Check console for error details
- Possible reasons:
  - Not logged in as agent
  - Backend not running
  - Token expired

**If you see "No Assignments Yet"**
- This means: API call succeeded, but NO complaints assigned to this agent
- Solution: Admin needs to assign complaints to this agent first

**If you see a table with complaints**
- Success! Complaints are showing

### Step 5: Common Issues & Solutions

#### Issue 1: "No Assignments Yet" showing
**Cause:** No complaints have been assigned to this agent
**Solution:**
1. Logout from agent account
2. Login as **Admin**
3. Go to Admin Dashboard
4. Find pending complaints
5. Select your agent from dropdown
6. Click "Assign"
7. Logout and login as agent again

#### Issue 2: Error "Access denied"
**Cause:** Not logged in as agent
**Solution:**
1. Check localStorage: Press F12 → Console → Type: `JSON.parse(localStorage.getItem('user'))`
2. Verify userType is 'agent'
3. If not, logout and login with agent account

#### Issue 3: Error "No token provided"
**Cause:** Not logged in
**Solution:**
1. Logout completely
2. Login again as agent

#### Issue 4: Empty array but should have complaints
**Cause:** Assignments exist but not returned by API
**Solution:**
1. Check backend logs
2. Verify agent ID matches in database

### Step 6: Test Complete Flow

**Create a test flow:**

1. **Create Customer Account**
   - Email: customer@test.com
   - Type: Customer/User

2. **Login as Customer → Submit Complaint**
   - Fill all details
   - Submit

3. **Create Admin Account**
   - Email: admin@test.com
   - Type: Admin

4. **Login as Admin → Assign Complaint**
   - Go to Dashboard
   - Find pending complaint
   - Select agent from dropdown
   - Click "Assign"

5. **Create Agent Account**
   - Email: agent@test.com
   - Type: Agent

6. **Login as Agent → Check Dashboard**
   - Should now see the complaint!

### Step 7: Verify in Console

After logging in as agent, check console logs:

```javascript
// Should see:
Fetching assignments for agent...
Token: Present
API Response: { assignments: [...] }
Number of assignments: 1  // or more

// If you see:
Number of assignments: 0
// Then no complaints are assigned yet
```

### Step 8: Manual API Test

Test the API directly in browser console:

```javascript
// After logging in as agent, run this in console:
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/complaints/assigned/agent', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

Expected response:
```json
{
  "assignments": [
    {
      "_id": "...",
      "agentId": "...",
      "complaintId": {
        "_id": "...",
        "userId": {
          "name": "Customer Name",
          "email": "customer@email.com",
          "phone": "123-456-7890"
        },
        "address": "...",
        "city": "...",
        "state": "...",
        "comment": "...",
        "photo": "...",
        "status": "assigned"
      },
      "status": "assigned",
      "assignedAt": "..."
    }
  ]
}
```

## Quick Checklist

- [ ] Backend server is running (http://localhost:5000)
- [ ] Frontend server is running (http://localhost:3000)
- [ ] Logged in as agent (userType: 'agent')
- [ ] At least one complaint has been assigned to this agent
- [ ] Browser console is open (F12)
- [ ] No error messages in console
- [ ] Token is present in localStorage

## Expected Behavior

### When NO complaints assigned:
```
┌────────────────────────────────────┐
│  Statistics                        │
│  Total: 0  Pending: 0              │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  No Assignments Yet                │
│  You don't have any assigned       │
│  complaints at the moment.         │
└────────────────────────────────────┘
```

### When complaints ARE assigned:
```
┌────────────────────────────────────┐
│  Statistics                        │
│  Total: 2  Pending: 1              │
└────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Assigned Complaints Table                           │
├────┬───────────┬──────────┬─────────┬────────────────┤
│ ID │ Customer  │  Email   │ Address │    Actions     │
│ #1 │ John Doe  │ john@... │ NY, USA │ [Chat][Status] │
│ #2 │ Jane Doe  │ jane@... │ CA, USA │ [Chat][Status] │
└────┴───────────┴──────────┴─────────┴────────────────┘
```

## Need Help?

1. Check browser console for exact error messages
2. Verify you completed all steps in order
3. Make sure admin assigned complaints to THIS specific agent
4. Try logging out and logging in again
5. Check backend terminal for any errors
