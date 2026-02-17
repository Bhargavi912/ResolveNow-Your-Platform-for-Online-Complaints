# ResolveNow Backend

This is the backend server for the ResolveNow complaint management system.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resolvenow
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user

### User
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update user profile

### Complaints
- POST `/api/complaints` - Create new complaint
- GET `/api/complaints/all` - Get all complaints (Admin only)
- GET `/api/complaints/user` - Get user's complaints
- GET `/api/complaints/:id` - Get complaint by ID
- PUT `/api/complaints/:id/status` - Update complaint status

### Assigned Complaints
- POST `/api/complaints/assign` - Assign complaint to agent (Admin only)
- GET `/api/complaints/assigned/agent` - Get agent's assigned complaints
- GET `/api/complaints/assigned/all` - Get all assignments (Admin only)
- PUT `/api/complaints/assigned/:id/status` - Update assignment status

### Messages
- POST `/api/messages` - Send message
- GET `/api/messages/:complaintId` - Get messages for a complaint

### Admin
- GET `/api/admin/users` - Get all users
- GET `/api/admin/agents` - Get all agents
- GET `/api/admin/stats` - Get dashboard statistics
