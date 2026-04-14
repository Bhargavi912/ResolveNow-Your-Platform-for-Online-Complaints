// Service Worker Registration

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[App] Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[App] New content is available; please refresh.');
                  
                  // Show update notification to user
                  if (window.confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                } else {
                  console.log('[App] Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[App] Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('[App] Service Workers not supported in this browser');
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[App] Service Worker unregistered');
      })
      .catch((error) => {
        console.error('[App] Error unregistering Service Worker:', error.message);
      });
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('[App] Notification permission granted');
      } else {
        console.log('[App] Notification permission denied');
      }
    });
  }
}

// Check if app is installed
export function checkIfInstalled() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[App] Running as installed PWA');
    return true;
  }
  console.log('[App] Running in browser');
  return false;
}

// Install prompt
let deferredPrompt;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[App] Install prompt available');
    
    // Show your custom install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[App] PWA was installed');
    deferredPrompt = null;
  });
}

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('[App] Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`[App] User response to install prompt: ${outcome}`);
  deferredPrompt = null;
  return outcome === 'accepted';
}
