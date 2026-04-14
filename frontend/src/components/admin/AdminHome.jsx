import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import AccordionAdmin from './AccordionAdmin';
import FooterC from '../common/FooterC';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function AdminHome({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0
  });
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, complaintsRes, agentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers }),
        axios.get(`${API_URL}/complaints/all`, { headers }),
        axios.get(`${API_URL}/admin/agents`, { headers })
      ]);

      setStats(statsRes.data.stats);
      setComplaints(complaintsRes.data.complaints);
      setAgents(agentsRes.data.agents);

      // Debug: Log complaints data
      console.log('Fetched complaints:', complaintsRes.data.complaints);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand>ResolveNow - Admin Portal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
              <Nav.Link as={Link} to="/admin/agents">Agents</Nav.Link>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name} - Manage the entire platform</p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="card-container">
              <div className="card">
                <h3>Total Users</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2', margin: '1rem 0' }}>
                  {stats.totalUsers}
                </p>
                <Link to="/admin/users" className="btn-primary-custom" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  View Users
                </Link>
              </div>

              <div className="card">
                <h3>Total Agents</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9c27b0', margin: '1rem 0' }}>
                  {stats.totalAgents}
                </p>
                <Link to="/admin/agents" className="btn-primary-custom" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  View Agents
                </Link>
              </div>

              <div className="card">
                <h3>Total Complaints</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9800', margin: '1rem 0' }}>
                  {stats.totalComplaints}
                </p>
              </div>

              <div className="card">
                <h3>Pending</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f44336', margin: '1rem 0' }}>
                  {stats.pendingComplaints}
                </p>
              </div>

              <div className="card">
                <h3>Resolved</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4caf50', margin: '1rem 0' }}>
                  {stats.resolvedComplaints}
                </p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Manage Complaints</h3>
              <AccordionAdmin complaints={complaints} agents={agents} onUpdate={fetchData} />
            </div>

            {/* DEBUG: Always show complaints table for admin */}
            <div className="card" style={{ marginTop: '2rem', background: '#f8f9fa', border: '2px solid #1976d2' }}>
              <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>All Complaints (Debug Table)</h3>
              {complaints && complaints.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Comment</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c._id}>
                          <td>#{c._id.slice(-6)}</td>
                          <td>{c.userId?.name || 'N/A'}</td>
                          <td>{c.status}</td>
                          <td>{c.city}</td>
                          <td>{c.state}</td>
                          <td>{c.comment?.substring(0, 40) || ''}</td>
                          <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No complaints found.</p>
              )}
            </div>
          </>
        )}
      </div>

      <FooterC />
    </div>
  );
}

export default AdminHome;
