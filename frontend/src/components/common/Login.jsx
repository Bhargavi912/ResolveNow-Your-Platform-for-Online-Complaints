import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted', formData);
    setError('');
    setLoading(true);

    try {
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        onLogin(response.data.user, response.data.token);
        
        // Redirect based on user type
        if (response.data.user.userType === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.data.user.userType === 'agent') {
          navigate('/agent-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/">ResolveNow</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Login to ResolveNow</h2>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading} onClick={() => console.log('Login button clicked')}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
