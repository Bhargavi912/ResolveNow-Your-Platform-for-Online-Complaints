# ResolveNow - Usage Guide

## 🚀 Quick Start

### Starting the Application

1. **Start Backend Server** (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend Server** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: http://localhost:3000

3. Open your browser and navigate to: **http://localhost:3000**

---

## 🔧 Troubleshooting Navigation Issues

### If "Get Started" button doesn't navigate:

#### Solution 1: Clear Browser Cache & Cookies
If you were previously logged in, your session might still be active.

**Steps to clear:**
1. Open browser Developer Tools (F12)
2. Go to "Application" or "Storage" tab
3. Clear localStorage
4. Refresh the page (Ctrl + F5)

**Or use this quick method:**
- Open browser console (F12)
- Type: `localStorage.clear()`
- Press Enter
- Refresh the page

#### Solution 2: Check Browser Console for Errors
1. Press F12 to open Developer Tools
2. Go to "Console" tab
3. Look for any red error messages
4. If you see errors, note them down

#### Solution 3: Hard Refresh
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

#### Solution 4: Verify Servers are Running
Check both servers are running without errors:
- Backend: https://resolvenow-backend-qf06.onrender.com/api/health (should return "Server is running")
- Frontend: http://localhost:3000 (should show the homepage)

---

## 👥 User Roles & Access

### 1. Customer/User Account
**Purpose:** Submit and track complaints

**How to Register:**
1. Click "Get Started" or "Sign Up" on homepage
2. Fill in your details
3. Select "Customer/User" from the dropdown
4. Click "Sign Up"

**Features:**
- Submit new complaints with details and photos
- Track complaint status in real-time
- Chat with assigned agents
- View complaint history

### 2. Agent Account
**Purpose:** Handle and resolve assigned complaints

**How to Register:**
1. Go to Sign Up page
2. Fill in your details
3. Select "Agent" from the dropdown
4. Click "Sign Up"

**Features:**
- View assigned complaints
- Update complaint status
- Chat with customers
- Manage multiple complaints

### 3. Admin Account
**Purpose:** Oversee the entire platform

**How to Register:**
1. Go to Sign Up page
2. Fill in your details
3. Select "Admin" from the dropdown
4. Click "Sign Up"

**Features:**
- View all complaints, users, and agents
- Assign complaints to agents
- Monitor platform statistics
- Manage user accounts

---

## 📱 Application Flow

### For Customers:

1. **Register/Login**
   - Navigate to http://localhost:3000
   - Click "Get Started" → Sign Up
   - Fill in details and register as "Customer/User"

2. **Submit a Complaint**
   - After login, go to Dashboard
   - Click "Submit Complaint"
   - Fill in all details:
     - Your name
     - Full address (address, city, state, pincode)
     - Describe your issue in detail
     - Optionally upload a photo (max 5MB)
   - Click "Submit Complaint"

3. **Track Status**
   - Go to "My Complaints" section
   - View status: Pending → Assigned → In Progress → Resolved → Closed
   - Click "Chat" to communicate with assigned agent
   - View complaint details

### For Agents:

1. **Register/Login**
   - Register as "Agent"
   - Login with your credentials

2. **View Assigned Complaints**
   - Dashboard shows all your assigned complaints
   - See statistics: Total, Pending, In Progress, Resolved

3. **Handle Complaints**
   - Review complaint details
   - Update status as you work on it
   - Chat with the customer for more information
   - Mark as resolved when completed

### For Admins:

1. **Register/Login**
   - Register as "Admin"
   - Login with your credentials

2. **Dashboard Overview**
   - View total users, agents, complaints
   - See pending and resolved complaints statistics

3. **Assign Complaints**
   - View all pending complaints in the accordion
   - Select an agent from dropdown
   - Click "Assign" to assign complaint to agent

4. **Manage Users & Agents**
   - Click "Users" to view all registered customers
   - Click "Agents" to view all agents and their performance

---

## 🎨 Features

### ✅ PWA Support
- Install the app on your device for offline access
- Look for the install prompt in your browser
- Works like a native app once installed

### ✅ Real-time Updates
- Chat functionality for user-agent communication
- Live status updates

### ✅ Secure Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for different user roles

### ✅ File Upload
- Upload photos with complaints
- Maximum file size: 5MB
- Supported formats: All image types

---

## 🗄️ Database

**MongoDB Connection:**
- Default: `mongodb://localhost:27017/resolvenow`
- Make sure MongoDB is running on your machine

To check if MongoDB is running:
```bash
# Windows (as Administrator)
net start MongoDB

# Or check service status
sc query MongoDB
```

---

## 🔐 Test Accounts

After setting up, create these test accounts to explore all features:

1. **Admin Account:**
   - Email: admin@resolvenow.com
   - Password: admin123
   - Role: Admin

2. **Agent Account:**
   - Email: agent@resolvenow.com
   - Password: agent123
   - Role: Agent

3. **Customer Account:**
   - Email: customer@resolvenow.com
   - Password: customer123
   - Role: Customer/User

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Get Started" button not working
**Cause:** Browser cache or already logged in
**Solution:** Clear localStorage and refresh

### Issue 2: Cannot submit complaint
**Cause:** Not logged in or token expired
**Solution:** Logout and login again

### Issue 3: Backend not responding
**Cause:** MongoDB not running or connection error
**Solution:** 
- Check if MongoDB service is running
- Verify connection string in backend/.env
- Check backend terminal for errors

### Issue 4: Frontend shows blank page
**Cause:** Build errors or React errors
**Solution:**
- Check browser console for errors
- Restart frontend server
- Clear node_modules and reinstall: `npm install`

### Issue 5: Photos not uploading
**Cause:** File size too large or wrong format
**Solution:**
- Ensure image is less than 5MB
- Use common image formats (jpg, png, gif, etc.)

---

## 📝 Important Notes

1. **First Time Setup:**
   - Make sure MongoDB is installed and running
   - Both backend and frontend servers must be running
   - Create accounts for different roles to test all features

2. **Data Persistence:**
   - All data is stored in MongoDB
   - Clearing localStorage only removes authentication token
   - To reset database, drop the `resolvenow` database in MongoDB

3. **Security:**
   - Change JWT_SECRET in backend/.env for production
   - Never commit .env file to git
   - Use strong passwords for production

4. **Performance:**
   - First load might take a few seconds
   - Chat updates every 3 seconds
   - Large images are stored as base64 (consider cloud storage for production)

---

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check backend terminal for server errors
3. Verify MongoDB is running
4. Clear cache and try again
5. Restart both servers

---

## 🎯 Next Steps

1. **Create Your First Account:**
   - Start with a Customer account to test the complaint flow
   - Create an Agent account to see the agent dashboard
   - Create an Admin account to manage everything

2. **Test the Complete Flow:**
   - Submit a complaint as Customer
   - Assign it as Admin
   - Handle it as Agent
   - Track status as Customer

3. **Explore Features:**
   - Try the chat functionality
   - Upload photos with complaints
   - Monitor statistics on admin dashboard

---

## 🌟 Enjoy using ResolveNow!

Your platform for efficient online complaint registration and management.
