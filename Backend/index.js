const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config');
const { User, Complaint, AssignedComplaint, Message } = require('./Schema');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userType = decoded.userType;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// User Registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: userType || 'user'
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
app.put('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== COMPLAINT ROUTES ====================

// Create a new complaint
app.post('/api/complaints', verifyToken, async (req, res) => {
  try {
    const { name, address, city, state, pincode, comment, photo } = req.body;

    const newComplaint = new Complaint({
      userId: req.userId,
      name,
      address,
      city,
      state,
      pincode,
      comment,
      photo: photo || null,
      status: 'pending'
    });

    await newComplaint.save();

    res.status(201).json({
      message: 'Complaint registered successfully',
      complaint: newComplaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all complaints (Admin only)
app.get('/api/complaints/all', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const complaints = await Complaint.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's complaints
app.get('/api/complaints/user', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get complaint by ID
app.get('/api/complaints/:id', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has access to this complaint
    if (req.userType === 'user' && complaint.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update complaint status
app.put('/api/complaints/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (req.userType !== 'admin' && req.userType !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ 
      message: 'Complaint status updated',
      complaint 
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== ASSIGNED COMPLAINT ROUTES ====================

// Assign complaint to agent (Admin only)
app.post('/api/complaints/assign', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { complaintId, agentId } = req.body;

    // Check if complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if agent exists
    const agent = await User.findById(agentId);
    if (!agent || agent.userType !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if already assigned
    const existingAssignment = await AssignedComplaint.findOne({ complaintId });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Complaint already assigned' });
    }

    // Create assignment
    const assignment = new AssignedComplaint({
      agentId,
      complaintId,
      agentName: agent.name,
      status: 'assigned'
    });

    await assignment.save();

    // Update complaint status
    complaint.status = 'assigned';
    await complaint.save();

    res.status(201).json({
      message: 'Complaint assigned successfully',
      assignment
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get agent's assigned complaints
app.get('/api/complaints/assigned/agent', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignments = await AssignedComplaint.find({ agentId: req.userId })
      .populate({
        path: 'complaintId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ assignedAt: -1 });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Get agent complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all assigned complaints (Admin only)
app.get('/api/complaints/assigned/all', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignments = await AssignedComplaint.find()
      .populate('agentId', 'name email')
      .populate({
        path: 'complaintId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ assignedAt: -1 });

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update assigned complaint status
app.put('/api/complaints/assigned/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (req.userType !== 'agent' && req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const assignment = await AssignedComplaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Also update the complaint status
    await Complaint.findByIdAndUpdate(
      assignment.complaintId,
      { status, updatedAt: Date.now() }
    );

    res.status(200).json({
      message: 'Status updated successfully',
      assignment
    });
  } catch (error) {
    console.error('Update assignment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== MESSAGE/CHAT ROUTES ====================

// Send a message
app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const { complaintId, message } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newMessage = new Message({
      complaintId,
      senderId: req.userId,
      name: user.name,
      message
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a complaint
app.get('/api/messages/:complaintId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ complaintId: req.params.complaintId })
      .populate('senderId', 'name userType')
      .sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users (Admin only)
app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({ userType: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all agents (Admin only)
app.get('/api/admin/agents', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const agents = await User.find({ userType: 'agent' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics (Admin only)
app.get('/api/admin/stats', verifyToken, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalUsers = await User.countDocuments({ userType: 'user' });
    const totalAgents = await User.countDocuments({ userType: 'agent' });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    res.status(200).json({
      stats: {
        totalUsers,
        totalAgents,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
