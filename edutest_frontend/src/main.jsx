// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Global styles including Tailwind base
import { AuthProvider } from '@contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

// Get Google Client ID from environment variables
const googleClientId = `${import.meta.env.VITE_GOOGLE_CLIENT_ID}`;
// // --- Add a console log here to confirm the client ID is loaded ---
// console.log("main.jsx: VITE_GOOGLE_CLIENT_ID:", googleClientId);
// // --- End console log ---


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
    
  </React.StrictMode>,
);



// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
