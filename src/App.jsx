import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import Selezione from './components/Selezione';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Controlla se c'è un utente salvato in sessionStorage
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Se utente loggato, mostra dashboard */}
        {user ? (
          <>
            <Route path="/dashboard" element={<DashboardPage user={user} onLogout={handleLogout} />} />
            <Route path="/selezione" element={<Selezione />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            {/* Se non loggato, mostra login o homepage pubblica */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/selezione" element={<Selezione />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

function Navigate({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

export default App;