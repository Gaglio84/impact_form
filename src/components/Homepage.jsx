import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Homepage() {
  const navigate = useNavigate();
  const pdfUrl = '../public/6._fac-simile_scheda_indicatori_piani_regionali_integrazione.pdf';

  const handleButtonClick = () => {
    navigate('/selezione');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="app">
      <div className="homepage-header">
        <h1>Progetto Lab Impact</h1>
        <button onClick={handleLoginClick} className="btn-login-header">
          Area Data Entry →
        </button>
      </div>

      <h2>Benvenuto nella piattaforma di inserimento dati</h2>
      <p>
        Per rendere la tua esperienza nel <em>data entry</em> il più semplice e intuitiva possibile, <br />
        ti guideremo passo dopo passo.
        La piattaforma è stata realizzata sulla base degli indicatori di progetto
        consultabili qui: <br /><a href={pdfUrl} target="_blank">Scheda Indicatori</a>.
      </p>
      <button onClick={handleButtonClick}>Iniziamo</button>

      <style>{`
        .homepage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .btn-login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.3s;
        }

        .btn-login-header:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}