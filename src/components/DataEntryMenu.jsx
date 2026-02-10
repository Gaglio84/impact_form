import { useNavigate } from 'react-router-dom';
import './Forms.css';

export default function DataEntryHome({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="data-entry-home">
      <div className="home-header">
        <div>
          <h1>Lab Impact </h1>
          <p>Benvenuto, <strong>{user.nome_organizzazione}</strong>
          <br />Ti guideremo passo dopo passo per inserire le informazioni nell'area di inserimento dati.</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="home-content">
        <h2>Cosa vuoi fare?</h2>
        
        <div className="options-grid">
          <div className="option-card" onClick={() => navigate('/selezione')}>
            <div className="option-icon">👥</div>
            <h3>Gestisci Destinatari</h3>
            <p>Inserisci e gestisci i dati dei destinatari delle tre Azioni</p>
            <button>Accedi →</button>
          </div>

          <div className="option-card" onClick={() => navigate('/dashboard')}>
            <div className="option-icon">📚</div>
            <h3>Attività Formative</h3>
            <p>Crea e gestisci le attività formative e associa i destinatari</p>
            <button>Accedi →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
