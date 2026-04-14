import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import FooterC from './FooterC';
import '../../App.css';

function About() {
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

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>About ResolveNow</h1>
          <p>Your Platform for Online Complaints</p>
        </div>

        <div className="card">
          <h3>What is ResolveNow?</h3>
          <p>
            An online complaint registration and management system is a software application or 
            platform that allows individuals or organizations to submit and track complaints or 
            issues they have encountered. It helps optimize the complaint handling process and 
            empowers organizations to develop a safety management system to efficiently resolve 
            customer complaints, while staying in line with industry guidelines and regulatory 
            compliance obligations.
          </p>
        </div>

        <div className="card">
          <h3>Key Features</h3>
          <ul style={{ textAlign: 'left', lineHeight: '2' }}>
            <li><strong>User Registration:</strong> Users can create accounts to submit complaints and track their progress.</li>
            <li><strong>Complaint Submission:</strong> Users can enter details of their complaints, including relevant information such as name, description of the issue, address, etc.</li>
            <li><strong>Tracking and Notifications:</strong> Users can track the progress of their complaints and receive notifications via email when there are any changes or resolutions.</li>
            <li><strong>User-Agent Interaction:</strong> Users can interact with the agent who has been assigned their complaint.</li>
            <li><strong>Assigning and Routing:</strong> The system assigns complaints to the appropriate department or personnel responsible for handling them.</li>
            <li><strong>Security and Confidentiality:</strong> The system ensures the security and confidentiality of user data through authentication, data encryption, and access controls.</li>
          </ul>
        </div>

        <div className="card">
          <h3>How It Works</h3>
          <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <h4>For Customers:</h4>
            <ol>
              <li>Register and create an account</li>
              <li>Submit detailed complaints with relevant information</li>
              <li>Track complaint status in real-time</li>
              <li>Communicate with assigned agents</li>
              <li>Receive updates and notifications</li>
            </ol>

            <h4>For Agents:</h4>
            <ol>
              <li>Access assigned complaints from dashboard</li>
              <li>Review complaint details and customer information</li>
              <li>Communicate with customers through built-in messaging</li>
              <li>Update complaint status as work progresses</li>
              <li>Resolve issues efficiently</li>
            </ol>

            <h4>For Admins:</h4>
            <ol>
              <li>Monitor all complaints on the platform</li>
              <li>Assign complaints to appropriate agents</li>
              <li>Manage user and agent accounts</li>
              <li>Oversee platform operations and ensure compliance</li>
              <li>Generate reports and analytics</li>
            </ol>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Get Started Today</h3>
          <p>Join ResolveNow and experience efficient complaint management.</p>
          <Link to="/signup" className="btn-primary-custom">
            Create Account
          </Link>
        </div>
      </div>

      <FooterC />
    </div>
  );
}

export default About;
