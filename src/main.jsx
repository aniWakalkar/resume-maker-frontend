import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './redux/store';
import App from './App';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error('VITE_GOOGLE_CLIENT_ID is not set in .env file');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider 
        clientId={googleClientId}
        onScriptLoadError={() => console.log('Google script failed to load')}
        onScriptLoadSuccess={() => console.log('Google script loaded')}
      >
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);