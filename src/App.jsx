import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicHomepage from './components/PublicHomepage';
import DestinatariManager from './components/DestinatariManager';
import DataEntryLogin from './components/DataEntryLogin';
import DataEntryMenu from './components/DataEntryMenu';
import AttivitaFormativeManager from './components/AttivitaFormativeManager';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/data-entry" element={<DataEntryMenu user={user} onLogout={handleLogout} />} />
            <Route path="/selezione" element={<DestinatariManager user={user} />} />
            <Route path="/dashboard" element={<AttivitaFormativeManager user={user} onLogout={handleLogout} />} />
            <Route path="/" element={<Navigate to="/data-entry" replace />} />
            <Route path="/login" element={<Navigate to="/data-entry" replace />} />
            <Route path="*" element={<Navigate to="/data-entry" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<PublicHomepage />} />
            <Route path="/login" element={<DataEntryLogin onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/selezione" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/data-entry" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;