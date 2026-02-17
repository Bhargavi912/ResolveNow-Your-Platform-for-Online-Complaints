# How to Add "Install App" Button

An optional **InstallPWA** component has been created for you. Here's how to add it to your app:

## Quick Setup (Recommended)

### Add to Home Page

Open: `frontend/src/components/common/Home.jsx`

```javascript
// Add import at the top
import InstallPWA from './InstallPWA';

// Add component before FooterC
return (
  <div>
    {/* ... existing navbar and content ... */}
    
    <InstallPWA />  {/* Add this line */}
    <FooterC />
  </div>
);
```

### Or Add to All Pages

Open: `frontend/src/App.js`

```javascript
// Add import
import InstallPWA from './components/common/InstallPWA';

// Add component at the end of JSX (before closing div)
return (
  <Router>
    <div className="App">
      {/* ... all your routes ... */}
      
      <InstallPWA />  {/* Add this line */}
    </div>
  </Router>
);
```

## What It Does

- ✅ Shows an install button when the app is installable
- ✅ Automatically hides after installation
- ✅ Doesn't show if already installed
- ✅ Beautiful card design with dismiss option
- ✅ Mobile & desktop compatible

## Preview

When users visit your app on mobile/desktop, they'll see a floating card at the bottom:

```
┌─────────────────────────────┐
│           📱                 │
│    Install ResolveNow       │
│                             │
│  Install our app for a      │
│  better experience!         │
│                             │
│  [Install App] [Maybe Later]│
└─────────────────────────────┘
```

## Customization

The button appears automatically when:
- User visits the app
- App is installable (meets PWA criteria)
- App is not already installed

Want to change styling? Edit the `styles` object in:
`frontend/src/components/common/InstallPWA.jsx`

## Optional: Custom Trigger

You can also trigger installation from your own button:

```javascript
import { showInstallPrompt } from './serviceWorkerRegistration';

// In your component
<button onClick={showInstallPrompt}>
  Install App
</button>
```

---

**Note:** The install prompt is automatically available. Adding the InstallPWA component just makes it more prominent and user-friendly!
