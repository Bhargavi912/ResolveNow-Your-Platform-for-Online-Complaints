import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../App.css';

const API_URL = 'http://localhost:5000/api';

function ChatWindow({ complaintId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [complaintId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/messages`,
        {
          complaintId,
          message: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #ddd', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1976d2',
        color: 'white'
      }}>
        <h4 style={{ margin: 0 }}>Chat - Complaint #{complaintId.slice(-6)}</h4>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.senderId._id === currentUserId ? 'message-sent' : 'message-received'}`}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                {msg.name} {msg.senderId.userType && `(${msg.senderId.userType})`}
              </div>
              <div>{msg.message}</div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn-primary-custom"
          disabled={loading || !newMessage.trim()}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
