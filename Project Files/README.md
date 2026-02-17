# ResolveNow - Online Complaint Registration and Management System

ResolveNow is a comprehensive web-based platform designed to streamline the process of submitting, tracking, and resolving complaints or issues encountered by individuals or organizations. It provides a centralized platform for efficient complaint management with features for users, agents, and administrators.

## Features

### For Users (Customers)
- **User Registration & Authentication**: Secure account creation and login
- **Complaint Submission**: Submit detailed complaints with relevant information
- **Real-time Tracking**: Monitor complaint status and progress
- **Chat Functionality**: Direct communication with assigned agents
- **Email Notifications**: Receive updates on complaint status changes

### For Agents
- **Dashboard**: View all assigned complaints and statistics
- **Complaint Management**: Update complaint status and track progress
- **Customer Communication**: Built-in chat system for customer interaction
- **Performance Tracking**: Monitor resolved vs. pending complaints

### For Administrators
- **Complete Overview**: Dashboard with system-wide statistics
- **User Management**: View and manage all registered users
- **Agent Management**: Monitor agent performance and workload
- **Complaint Assignment**: Assign complaints to appropriate agents
- **System Monitoring**: Track overall platform performance

## Technical Stack

### Frontend
- **React.js** - UI library for building interactive user interfaces
- **React Router** - Client-side routing
- **Bootstrap** - Responsive CSS framework
- **Material-UI** - React component library
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/resolvenow.git
cd ResolveNow
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and configure
# Copy .env.example to .env and update values
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resolvenow
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Start MongoDB service (if not already running)
# On Windows: net start MongoDB
# On Mac/Linux: sudo systemctl start mongod

# Start the backend server
npm start
# Or for development with auto-reload
npm run dev
\`\`\`

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
\`\`\`

The frontend will open automatically in your browser at `http://localhost:3000`

## Usage

### Getting Started

1. **Register an Account**
   - Visit `http://localhost:3000/signup`
   - Choose account type (User, Agent, or Admin)
   - Fill in registration details

2. **Login**
   - Visit `http://localhost:3000/login`
   - Enter credentials
   - You'll be redirected to the appropriate dashboard

### User Workflow

1. **Submit Complaint**: Navigate to "Submit Complaint" and fill out the form
2. **Track Status**: View all complaints in "My Complaints" section
3. **Communicate**: Use the chat feature to communicate with assigned agents
4. **Receive Updates**: Get notified when complaint status changes

### Agent Workflow

1. **View Assignments**: See all assigned complaints in the dashboard
2. **Update Status**: Change complaint status as work progresses
3. **Communicate**: Chat with customers for additional information
4. **Resolve Issues**: Mark complaints as resolved when completed

### Admin Workflow

1. **Monitor System**: View overall statistics in the dashboard
2. **Assign Complaints**: Assign pending complaints to available agents
3. **Manage Users**: View and manage all users and agents
4. **Track Performance**: Monitor agent workload and resolution rates

## Project Structure

\`\`\`
ResolveNow/
├── backend/
│   ├── node_modules/
│   ├── config.js           # Database configuration
│   ├── index.js            # Express server and API routes
│   ├── Schema.js           # MongoDB schemas
│   ├── .env                # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AccordionAdmin.jsx
│   │   │   │   ├── AdminHome.jsx
│   │   │   │   ├── AgentInfo.jsx
│   │   │   │   └── UserInfo.jsx
│   │   │   ├── agent/
│   │   │   │   └── AgentHome.jsx
│   │   │   ├── common/
│   │   │   │   ├── About.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── FooterC.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   └── user/
│   │   │       ├── Complaint.jsx
│   │   │       ├── HomePage.jsx
│   │   │       └── Status.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .gitignore
│   ├── package.json
│   └── README.md
└── README.md
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/all` - Get all complaints (Admin)
- `GET /api/complaints/user` - Get user's complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id/status` - Update complaint status

### Assigned Complaints
- `POST /api/complaints/assign` - Assign complaint to agent (Admin)
- `GET /api/complaints/assigned/agent` - Get agent's assigned complaints
- `GET /api/complaints/assigned/all` - Get all assignments (Admin)
- `PUT /api/complaints/assigned/:id/status` - Update assignment status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:complaintId` - Get messages for a complaint

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/agents` - Get all agents
- `GET /api/admin/stats` - Get dashboard statistics

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication
- **Protected Routes**: Authorization middleware for secure endpoints
- **Input Validation**: Server-side validation of all inputs
- **CORS**: Configured cross-origin resource sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env` file
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in backend `.env` file
- Update API_URL in frontend components if needed

### Dependencies Issues
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## License

This project is licensed under the MIT License.

## Support

For support, email support@resolvenow.com or create an issue in the repository.

## Acknowledgments

- MongoDB for database solutions
- React team for the amazing UI library
- Express.js for the robust backend framework
- Bootstrap and Material-UI for UI components

---

**ResolveNow** - Efficiently manage complaints and improve customer satisfaction.
