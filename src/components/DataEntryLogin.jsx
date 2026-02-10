import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Forms.css';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: queryError } = await supabase
        .from('data_entry_users')
        .select('id, username, nome_organizzazione')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (queryError || !data) {
        setError('Username o password non corretti');
        setLoading(false);
        return;
      }

      // Salva i dati dell'utente in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(data));
      onLoginSuccess(data);
      // Reindirizza a data-entry dopo il login
      navigate('/data-entry');
    } catch (err) {
      setError('Errore di connessione');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Lab Impact <br /> Data Entry Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Inserisci username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Inserisci password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
