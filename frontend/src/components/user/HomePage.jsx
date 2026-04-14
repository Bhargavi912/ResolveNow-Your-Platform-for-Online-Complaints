import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import FooterC from '../common/FooterC';
import '../../App.css';

function HomePage({ user, onLogout }) {
  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand>ResolveNow</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/user-dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/complaint">Submit Complaint</Nav.Link>
              <Nav.Link as={Link} to="/status">My Complaints</Nav.Link>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <p>Manage your complaints and track their status</p>
        </div>

        <div className="card-container">
          <div className="card">
            <h3>Submit New Complaint</h3>
            <p>Have an issue? Register a new complaint and track its progress.</p>
            <Link to="/complaint" className="btn-primary-custom">
              Submit Complaint
            </Link>
          </div>

          <div className="card">
            <h3>Track Complaints</h3>
            <p>View all your submitted complaints and their current status.</p>
            <Link to="/status" className="btn-primary-custom">
              View Status
            </Link>
          </div>

          <div className="card">
            <h3>Your Profile</h3>
            <p>
              <strong>Name:</strong> {user?.name}<br />
              <strong>Email:</strong> {user?.email}<br />
              <strong>Phone:</strong> {user?.phone}
            </p>
          </div>
        </div>

        <div className="card">
          <h3>How it Works</h3>
          <div style={{ textAlign: 'left', lineHeight: '2', padding: '1rem' }}>
            <ol>
              <li><strong>Submit:</strong> Fill out the complaint form with all necessary details</li>
              <li><strong>Track:</strong> Monitor the status of your complaint in real-time</li>
              <li><strong>Communicate:</strong> Chat with the assigned agent for updates</li>
              <li><strong>Resolve:</strong> Get your issue resolved efficiently</li>
            </ol>
          </div>
        </div>
      </div>

      <FooterC />
    </div>
  );
}

export default HomePage;
