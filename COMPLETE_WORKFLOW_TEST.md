# Complete System Test - Step by Step

## Understanding the Workflow

**IMPORTANT:** Agents only see complaints that have been ASSIGNED to them by an admin. This is by design!

```
Customer → Submit Complaint → Pending
                ↓
Admin → View Pending → Assign to Agent
                ↓
Agent → View Assigned Complaints → Take Action
```

## Step-by-Step Test

### Step 1: Create All Three Account Types

You need THREE different accounts:

#### A. Create Customer Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill form:
   - Name: `Test Customer`
   - Email: `customer@test.com`
   - Password: `password123`
   - Phone: `1234567890`
   - **User Type: Customer/User** ✓
4. Click Register

#### B. Create Agent Account
1. Logout (if logged in)
2. Click "Sign Up"
3. Fill form:
   - Name: `Test Agent`
   - Email: `agent@test.com`
   - Password: `password123`
   - Phone: `9876543210`
   - **User Type: Agent** ✓
4. Click Register
5. **Remember this agent's name!**

#### C. Create Admin Account
1. Logout
2. Click "Sign Up"
3. Fill form:
   - Name: `Test Admin`
   - Email: `admin@test.com`
   - Password: `password123`
   - Phone: `5555555555`
   - **User Type: Admin** ✓
4. Click Register

---

## Step 2: Submit Complaint as Customer

1. **Login as Customer**
   - Email: `customer@test.com`
   - Password: `password123`

2. **Navigate to "Submit Complaint"**

3. **Fill the form:**
   - Name: `Test Customer`
   - Address: `123 Main Street`
   - City: `New York`
   - State: `NY`
   - Pincode: `123456`
   - Complaint: `Water supply issue in my area`
   - Photo: Optional

4. **Click "Submit Complaint"**

5. **Verify Success:**
   - Should see: "Complaint submitted successfully!"
   - Should redirect to Status page
   - Should see your complaint with status "pending"

6. **Logout**

---

## Step 3: Assign Complaint to Agent (Admin)

1. **Login as Admin**
   - Email: `admin@test.com`
   - Password: `password123`

2. **Go to Admin Dashboard**
   - Should see statistics
   - Should see "Pending Complaints" section
   - Should see the complaint you just submitted

3. **Assign to Agent:**
   - Find the complaint in the list
   - Click on the dropdown next to it
   - Select: **"Test Agent"** (the agent you created)
   - Click **"Assign"** button

4. **Verify Assignment:**
   - Complaint status should change to "assigned"
   - Should see success message
   - Complaint moves to "Assigned Complaints" section

5. **Logout**

---

## Step 4: View as Agent

1. **Login as Agent**
   - Email: `agent@test.com`
   - Password: `password123`

2. **Go to Agent Dashboard**
   - **NOW you should see the complaint!**
   - Should display:
     - Customer Name: Test Customer
     - Email: customer@test.com
     - Phone: 1234567890
     - Address: 123 Main Street, New York, NY - 123456
     - Issue: Water supply issue in my area
     - Status: assigned

3. **Test Actions:**
   - Click "Chat" → Opens chat window
   - Click "Update Status" → Can change to In-Progress/Resolved
   - Click "View Details" → See full complaint info

---

## Common Mistakes

### ❌ Mistake 1: Expecting agent to see ALL complaints
**Wrong:** Agent should see all submitted complaints
**Correct:** Agent only sees complaints assigned TO THEM

### ❌ Mistake 2: Skipping admin assignment step
**Wrong:** Customer submits → Agent sees it
**Correct:** Customer submits → Admin assigns → Agent sees it

### ❌ Mistake 3: Using wrong account type
- Customer submits complaints
- Admin assigns complaints
- Agent handles assigned complaints

### ❌ Mistake 4: Assigning to different agent than you're logged in as
- If admin assigns to "Agent A"
- You must login as "Agent A" to see it
- "Agent B" won't see it

---

## Verification Checklist

After following all steps, verify:

- [ ] Customer can submit complaint
- [ ] Customer sees complaint in "My Complaints" with status "pending"
- [ ] Admin sees complaint in "Pending Complaints"
- [ ] Admin can assign complaint to agent
- [ ] After assignment, complaint status changes to "assigned"
- [ ] Agent sees complaint in their dashboard
- [ ] Agent can chat with customer
- [ ] Agent can update complaint status

---

## Quick Reference

### Customer Functions:
- ✓ Submit complaints
- ✓ View their own complaints
- ✓ Chat with assigned agent
- ✗ Cannot see other customers' complaints
- ✗ Cannot assign complaints

### Agent Functions:
- ✓ View complaints assigned to them
- ✓ Chat with customers
- ✓ Update complaint status
- ✗ Cannot see unassigned complaints
- ✗ Cannot see complaints assigned to other agents

### Admin Functions:
- ✓ View ALL complaints
- ✓ Assign complaints to agents
- ✓ View statistics
- ✓ Manage users
- ✗ Cannot submit complaints (admins don't file complaints)

---

## Troubleshooting

### "Agent dashboard is empty"

**Check:**
1. Are you logged in as the correct agent?
2. Did admin assign any complaints to THIS agent?
3. Open browser console - what does it show?

**Solution:**
- Login as admin
- Assign at least one complaint to this agent
- Then login as agent again

### "Admin doesn't see pending complaints"

**Check:**
1. Did customer actually submit a complaint?
2. Check backend terminal for errors
3. Check MongoDB connection

**Solution:**
- Have customer submit a test complaint
- Login as admin
- Should appear in Pending section

### "Assignment not working"

**Check:**
1. Is the agent account properly created with userType: "agent"?
2. Check browser console for errors
3. Check backend terminal

**Solution:**
- Make sure agent account exists
- Make sure you selected agent from dropdown
- Click Assign button

---

## Database View

If you have MongoDB access, verify:

```javascript
// Check complaints
db.complaints.find().pretty()
// Should show complaint with status: "pending" or "assigned"

// Check assigned complaints
db.assigned_complaints.find().pretty()
// Should show agentId, complaintId, status

// Check users
db.users.find({}, {name: 1, email: 1, userType: 1}).pretty()
// Should show all three user types
```

---

## Expected Behavior

### After Customer Submits:
```
Complaints Collection:
{
  userId: "customer_id",
  name: "Test Customer",
  address: "123 Main Street",
  city: "New York",
  status: "pending"  ← Initially pending
}
```

### After Admin Assigns:
```
Complaints Collection:
{
  ...
  status: "assigned"  ← Updated to assigned
}

Assigned_Complaints Collection (NEW):
{
  agentId: "agent_id",
  complaintId: "complaint_id",
  agentName: "Test Agent",
  status: "assigned"
}
```

### Agent Dashboard Query:
```javascript
// Fetches from assigned_complaints where agentId = logged-in agent
// Then populates complaint and customer details
// That's why agent only sees THEIR assigned complaints
```

---

## Summary

Your system is working CORRECTLY! The workflow is:

1. **Customer** submits → Complaint is "pending"
2. **Admin** assigns → Complaint is "assigned" to specific agent
3. **Agent** views → Only sees complaints assigned to them

This is the proper workflow for a complaint management system where admins triage and distribute work to agents!

---

## Testing Different Scenarios

### Test 1: Multiple Complaints
1. Submit 3 complaints as customer
2. Login as admin
3. Assign each to different agents (or same agent)
4. Verify each agent only sees their assigned complaints

### Test 2: Status Updates
1. Agent changes status to "In Progress"
2. Customer should see updated status
3. Admin should see updated status

### Test 3: Chat System
1. Customer submits complaint
2. Admin assigns to agent
3. Agent sends message
4. Customer should receive message
5. Customer replies
6. Agent should see reply

---

Need help? Check:
- Browser console (F12)
- Backend terminal
- COMPLAINT_TROUBLESHOOTING.md
- AGENT_DEBUG_GUIDE.md
