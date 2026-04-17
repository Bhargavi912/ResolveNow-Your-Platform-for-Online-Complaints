import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../../App.css';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Clear any existing auth data first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('Get Started clicked - navigating to /signup');
    
    // THE FIX: Use React's navigate instead of window.location
    navigate('/signup');
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked - navigating to /about');
    
    // THE FIX: Use React's navigate instead of window.location
    navigate('/about');
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

      <div className="home-container">
        <div className="home-content">
          <h1>Welcome to ResolveNow</h1>
          <p>
            Your trusted platform for online complaint registration and management. 
            Submit, track, and resolve your issues efficiently with our streamlined system.
          </p>
          
          <div className="home-buttons">
            <button 
              type="button"
              onClick={handleGetStarted} 
              className="btn-primary-custom"
              style={{ 
                border: 'none', 
                outline: 'none', 
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1000
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              Get Started
            </button>
            <button 
              type="button"
              onClick={handleLearnMore} 
              className="btn-secondary-custom"
              style={{ 
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1000
              }}
            >
              Learn More
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Home;