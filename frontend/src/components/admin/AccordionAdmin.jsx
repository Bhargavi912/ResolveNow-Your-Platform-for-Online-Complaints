import React, { useState } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function AccordionAdmin({ complaints, agents, onUpdate }) {
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(null);

  const assignComplaint = async (complaintId, agentId) => {
    if (!agentId) {
      alert('Please select an agent');
      return;
    }

    setAssigningComplaint(complaintId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/complaints/assign`,
        { complaintId, agentId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Complaint assigned successfully');
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign complaint');
    } finally {
      setAssigningComplaint(null);
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
  const openPhotoModal = (photoUrl) => {
    setViewPhoto(photoUrl);
  };

  const closePhotoModal = () => {
    setViewPhoto(null);
  };
  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const assignedComplaints = complaints.filter(c => c.status !== 'pending');

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>Pending Complaints ({pendingComplaints.length})</strong>
          </Accordion.Header>
          <Accordion.Body>
            {pendingComplaints.length === 0 ? (
              <p>No pending complaints</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Issue</th>
                      <th>Photo</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Assign To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>#{complaint._id.slice(-6)}</td>
                        <td>{complaint.userId.name}</td>
                        <td>{complaint.userId.email}</td>
                        <td>{complaint.userId.phone}</td>
                        <td>{complaint.city}, {complaint.state}</td>
                        <td>{complaint.comment.substring(0, 40)}...</td>
                        <td>
                          {complaint.photo ? (
                            <button
                              onClick={() => openPhotoModal(complaint.photo)}
                              className="btn-primary-custom"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                            >
                              View
                            </button>
                          ) : (
                            <span style={{ color: '#999', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td>{getStatusBadge(complaint.status)}</td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                              id={`agent-${complaint._id}`}
                              style={{
                                padding: '0.4rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd'
                              }}
                              disabled={assigningComplaint === complaint._id}
                            >
                              <option value="">Select Agent</option>
                              {agents.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const agentId = document.getElementById(`agent-${complaint._id}`).value;
                                assignComplaint(complaint._id, agentId);
                              }}
                              disabled={assigningComplaint === complaint._id}
                              className="btn-primary-custom"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                              {assigningComplaint === complaint._id ? 'Assigning...' : 'Assign'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <strong>Assigned & In-Progress Complaints ({assignedComplaints.length})</strong>
          </Accordion.Header>
          <Accordion.Body>
            {assignedComplaints.length === 0 ? (
              <p>No assigned complaints</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Issue</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>#{complaint._id.slice(-6)}</td>
                        <td>{complaint.userId.name}</td>
                        <td>{complaint.userId.email}</td>
                        <td>{complaint.city}, {complaint.state}</td>
                        <td>{complaint.comment.substring(0, 50)}...</td>
                        <td>{getStatusBadge(complaint.status)}</td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

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
  );
}

export default AccordionAdmin;
