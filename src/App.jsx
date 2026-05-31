import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login, Register } from './modules/auth';
import { Dashboard } from './modules/dashboard';

const GOOGLE_CLIENT_ID = '708757767204-bmkvmkhi2tsgdapajfgho5dbdf2v3auc.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;