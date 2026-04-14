import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import FooterC from '../common/FooterC';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function Complaint({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    comment: '',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          photo: reader.result
        });
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({
      ...formData,
      photo: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    console.log('=== COMPLAINT SUBMISSION START ===');
    console.log('Form data:', formData);

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('API URL:', `${API_URL}/complaints`);
      console.log('Submitting complaint...');

      const response = await axios.post(
        `${API_URL}/complaints`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('API Response:', response.data);
      console.log('Complaint submitted successfully!');

      setSuccess('Complaint submitted successfully!');
      setFormData({
        name: user?.name || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        comment: '',
        photo: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);

      setTimeout(() => {
        console.log('Redirecting to status page...');
        navigate('/status');
      }, 2000);
    } catch (err) {
      console.error('=== COMPLAINT SUBMISSION ERROR ===');
      console.error('Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
      console.log('=== COMPLAINT SUBMISSION END ===');
    }
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
          <h1>Submit a Complaint</h1>
          <p>Fill out the form below to register your complaint</p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-control"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  placeholder="6-digit pincode"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Complaint Description</label>
                <textarea
                  id="comment"
                  name="comment"
                  className="form-control"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Add Photo (Optional)</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  className="form-control"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  style={{ padding: '0.5rem' }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                  Upload an image to support your complaint (Max size: 5MB)
                </small>
                
                {photoPreview && (
                  <div style={{ marginTop: '1rem', position: 'relative' }}>
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '300px', 
                        maxHeight: '300px', 
                        borderRadius: '8px',
                        border: '2px solid #ddd',
                        display: 'block'
                      }} 
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterC />
    </div>
  );
}

export default Complaint;
