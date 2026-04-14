import React, { useState, useEffect } from 'react';

/**
 * InstallPWA Component
 * 
 * Displays an "Install App" button when the PWA is installable.
 * Add this component to any page where you want to show the install prompt.
 * 
 * Usage:
 * import InstallPWA from './InstallPWA';
 * 
 * Then in your JSX:
 * <InstallPWA />
 */

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed');
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
      console.log('Install prompt is available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    const handleAppInstalled = () => {
      console.log('App was installed');
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Install prompt is not available. Try adding the app from your browser menu.');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the saved prompt
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
  };

  if (!showInstall) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>📱</div>
        <div style={styles.content}>
          <h3 style={styles.title}>Install ResolveNow</h3>
          <p style={styles.description}>
            Install our app for a better experience - works offline and launches faster!
          </p>
        </div>
        <div style={styles.buttons}>
          <button onClick={handleInstallClick} style={styles.installBtn}>
            Install App
          </button>
          <button onClick={handleDismiss} style={styles.dismissBtn}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    maxWidth: '500px',
    width: 'calc(100% - 40px)',
    animation: 'slideUp 0.3s ease-out'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '2px solid #1976d2'
  },
  icon: {
    fontSize: '2.5rem',
    textAlign: 'center'
  },
  content: {
    textAlign: 'center'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#1976d2',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  description: {
    margin: 0,
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  installBtn: {
    flex: 1,
    background: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      background: '#1565c0'
    }
  },
  dismissBtn: {
    flex: 1,
    background: 'transparent',
    color: '#666',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default InstallPWA;
