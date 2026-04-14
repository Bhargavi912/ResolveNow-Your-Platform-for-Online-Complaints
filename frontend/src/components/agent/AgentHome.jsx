import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import FooterC from '../common/FooterC';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function AgentHome({ user, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching assignments for agent...');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('API URL:', `${API_URL}/complaints/assigned/agent`);
      
      const response = await axios.get(`${API_URL}/complaints/assigned/agent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data);
      console.log('Assignments received:', response.data.assignments);
      console.log('Number of assignments:', response.data.assignments?.length || 0);
      
      setAssignments(response.data.assignments || []);
      setError('');
    } catch (err) {
      console.error('Error fetching assignments:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (assignmentId, newStatus) => {
    setUpdatingStatus(assignmentId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/complaints/assigned/${assignmentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchAssignments();
      alert('Status updated successfully');
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      assigned: 'status-assigned',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || 'status-assigned'}`}>
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

  const getStats = () => {
    const total = assignments.length;
    const assigned = assignments.filter(a => a.status === 'assigned').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const resolved = assignments.filter(a => a.status === 'resolved').length;

    console.log('Stats calculated:', { total, assigned, inProgress, resolved });
    return { total, assigned, inProgress, resolved };
  };

  const stats = getStats();
  
  console.log('AgentHome render - assignments:', assignments);
  console.log('AgentHome render - loading:', loading);
  console.log('AgentHome render - error:', error);

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand>ResolveNow - Agent Portal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <span style={{ color: 'white', marginRight: '1rem', alignSelf: 'center' }}>
                Welcome, {user?.name}
              </span>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Agent Dashboard</h1>
          <p>Manage your assigned complaints</p>
        </div>

        <div className="card-container">
          <div className="card">
            <h3>Total Assigned</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2', margin: '1rem 0' }}>
              {stats.total}
            </p>
          </div>

          <div className="card">
            <h3>Pending Action</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9800', margin: '1rem 0' }}>
              {stats.assigned}
            </p>
          </div>

          <div className="card">
            <h3>In Progress</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2196f3', margin: '1rem 0' }}>
              {stats.inProgress}
            </p>
          </div>

          <div className="card">
            <h3>Resolved</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4caf50', margin: '1rem 0' }}>
              {stats.resolved}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Loading assignments...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : assignments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>No Assignments Yet</h3>
            <p>You don't have any assigned complaints at the moment.</p>
          </div>
        ) : (
          <div className="table-container">
            <h3 style={{ marginBottom: '1rem' }}>Assigned Complaints</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Address</th>
                  <th>Issue</th>
                  <th>Photo</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>#{assignment.complaintId._id.slice(-6)}</td>
                    <td>{assignment.complaintId.userId.name}</td>
                    <td>{assignment.complaintId.userId.email}</td>
                    <td>
                      {assignment.complaintId.city}, {assignment.complaintId.state}
                    </td>
                    <td>{assignment.complaintId.comment.substring(0, 40)}...</td>
                    <td>
                      {assignment.complaintId.photo ? (
                        <button
                          onClick={() => openPhotoModal(assignment.complaintId.photo)}
                          className="btn-primary-custom"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          View
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: '0.85rem' }}>-</span>
                      )}
                    </td>
                    <td>{getStatusBadge(assignment.status)}</td>
                    <td>{new Date(assignment.assignedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openChat(assignment.complaintId._id)}
                          className="btn-primary-custom"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Chat
                        </button>
                        
                        {assignment.status !== 'resolved' && assignment.status !== 'closed' && (
                          <select
                            value={assignment.status}
                            onChange={(e) => updateStatus(assignment._id, e.target.value)}
                            disabled={updatingStatus === assignment._id}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '5px',
                              border: '1px solid #ddd',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        )}
                      </div>
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
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 2000,
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
        )}
      </div>

      <FooterC />
    </div>
  );
}

export default AgentHome;
