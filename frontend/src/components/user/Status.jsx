import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import FooterC from '../common/FooterC';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function Status({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/complaints/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.complaints);
    } catch (err) {
      setError('Failed to load complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      assigned: 'status-assigned',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const openChat = (complaintId) => {
    setSelectedComplaint(complaintId);
  };

  const closeChat = () => {
    setSelectedComplaint(null);
  };

  const openPhotoModal = (photoUrl) => {
    setViewPhoto(photoUrl);
  };

  const closePhotoModal = () => {
    setViewPhoto(null);
  };

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
          <h1>My Complaints</h1>
          <p>Track the status of all your submitted complaints</p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Loading complaints...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>No Complaints Yet</h3>
            <p>You haven't submitted any complaints.</p>
            <Link to="/complaint" className="btn-primary-custom">
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Description</th>
                  <th>Photo</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>#{complaint._id.slice(-6)}</td>
                    <td>{complaint.name}</td>
                    <td>{complaint.address}</td>
                    <td>{complaint.city}, {complaint.state}</td>
                    <td>{complaint.comment.substring(0, 50)}...</td>
                    <td>
                      {complaint.photo ? (
                        <button
                          onClick={() => openPhotoModal(complaint.photo)}
                          className="btn-primary-custom"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          View Photo
                        </button>
                      ) : (
                        <span style={{ color: '#999' }}>No photo</span>
                      )}
                    </td>
                    <td>{getStatusBadge(complaint.status)}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => openChat(complaint._id)}
                        className="btn-primary-custom"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedComplaint && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <ChatWindow complaintId={selectedComplaint} onClose={closeChat} />
          </div>
        )}

        {selectedComplaint && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
            onClick={closeChat}
          />
        )}

        {viewPhoto && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 1001,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
              }}
              onClick={closePhotoModal}
            >
              <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                <img 
                  src={viewPhoto} 
                  alt="Complaint" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '85vh',
                    borderRadius: '10px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                  }} 
                />
                <button
                  onClick={closePhotoModal}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <FooterC />
    </div>
  );
}

export default Status;
