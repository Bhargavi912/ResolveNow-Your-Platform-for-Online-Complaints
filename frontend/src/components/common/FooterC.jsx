import React from 'react';
import '../../App.css';

function FooterC() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} ResolveNow. All rights reserved.</p>
        <p>Your trusted platform for online complaint registration and management.</p>
      </div>
    </footer>
  );
}

export default FooterC;
