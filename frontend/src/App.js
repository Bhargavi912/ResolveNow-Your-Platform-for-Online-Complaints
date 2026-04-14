import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Common Components
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';
import About from './components/common/About';

// User Components
import HomePage from './components/user/HomePage';
import Complaint from './components/user/Complaint';
import Status from './components/user/Status';

// Agent Components
import AgentHome from './components/agent/AgentHome';

// Admin Components
import AdminHome from './components/admin/AdminHome';
import UserInfo from './components/admin/UserInfo';
import AgentInfo from './components/admin/AgentInfo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserType(parsedUser.userType);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setUserType(userData.userType);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
  };

  const ProtectedRoute = ({ children, allowedTypes }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedTypes && !allowedTypes.includes(userType)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={`/${userType}-dashboard`} replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to={`/${userType}-dashboard`} replace /> : 
                <SignUp />
            } 
          />

          {/* User Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedTypes={['user']}>
                <HomePage user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaint"
            element={
              <ProtectedRoute allowedTypes={['user']}>
                <Complaint user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/status"
            element={
              <ProtectedRoute allowedTypes={['user']}>
                <Status user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute allowedTypes={['agent']}>
                <AgentHome user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <AdminHome user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <UserInfo user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <AgentInfo user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
