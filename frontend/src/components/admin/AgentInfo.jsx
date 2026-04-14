import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import FooterC from '../common/FooterC';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function AgentInfo({ user, onLogout }) {
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [agentsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/agents`, { headers }),
        axios.get(`${API_URL}/complaints/assigned/all`, { headers })
      ]);

      setAgents(agentsRes.data.agents);
      setAssignments(assignmentsRes.data.assignments);
    } catch (err) {
      setError('Failed to load agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAgentStats = (agentId) => {
    const agentAssignments = assignments.filter(a => a.agentId._id === agentId);
    return {
      total: agentAssignments.length,
      pending: agentAssignments.filter(a => a.status === 'assigned').length,
      inProgress: agentAssignments.filter(a => a.status === 'in-progress').length,
      resolved: agentAssignments.filter(a => a.status === 'resolved').length
    };
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
          <h1>Agent Management</h1>
          <p>View and manage all agents and their performance</p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Loading agents...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : agents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>No Agents Found</h3>
            <p>There are no registered agents yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <h3 style={{ marginBottom: '1rem' }}>Total Agents: {agents.length}</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Assigned</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => {
                  const stats = getAgentStats(agent._id);
                  return (
                    <tr key={agent._id}>
                      <td>{index + 1}</td>
                      <td>#{agent._id.slice(-6)}</td>
                      <td>{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.phone}</td>
                      <td>
                        <span className="status-badge status-in-progress">
                          {stats.total}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge status-pending">
                          {stats.pending}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge status-assigned">
                          {stats.inProgress}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge status-resolved">
                          {stats.resolved}
                        </span>
                      </td>
                      <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {assignments.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Recent Assignments</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Agent</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Assigned Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.slice(0, 10).map((assignment) => (
                    <tr key={assignment._id}>
                      <td>#{assignment.complaintId._id.slice(-6)}</td>
                      <td>{assignment.agentName}</td>
                      <td>{assignment.complaintId.userId.name}</td>
                      <td>
                        <span className={`status-badge status-${assignment.status}`}>
                          {assignment.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(assignment.assignedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <FooterC />
    </div>
  );
}

export default AgentInfo;
