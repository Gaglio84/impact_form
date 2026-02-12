import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import './Forms.css';

export default function DataEntryHome({ user, onLogout }) {
  const navigate = useNavigate();

  const azioni = [
    { id: 1, nome: 'Azione 1', descrizione: 'Gestione Operatori e Mediatori' },
    { id: 2, nome: 'Azione 2', descrizione: 'Gestione Cittadini e Mediatori' },
    { id: 3, nome: 'Azione 3', descrizione: 'Gestione Cittadini e Mediatori' },
    { id: 'fes', nome: 'FES', descrizione: 'Fondo Europeo Sociale' },
  ];

  return (
    <div className="data-entry-home">
      <div className="home-header">
        <div>
          <h1>Lab Impact</h1>
          <p>Benvenuto, <strong>{user.nome_organizzazione}</strong>
          <br />Seleziona un'Azione e scegli se gestire Destinatari o Attività Formative.</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="home-content">
        <h2>Seleziona un'Azione</h2>
        
        <div className="azioni-grid">
          {azioni.map((azione) => (
            <div key={azione.id} className="azione-card">
              <h3>{azione.nome}</h3>
              
              <div className="azione-buttons">
                <button 
                  onClick={() => navigate(`/selezione/${azione.id}/destinatari`)}
                  className="btn-azione btn-azione-destinatari"
                >
                  👥 Destinatari
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/${azione.id}`)}
                  className="btn-azione btn-azione-attivita"
                >
                  📚 Attività
                </button>
              </div>
            </div>
          ))}
          
          <div className="azione-card">
            <h3>Scheda Qualitativa</h3>
            <div className="azione-buttons">
              <button 
                onClick={() => navigate('/qualitativa')}
                className="btn-azione btn-azione-qualitativa"
              >
                Accedi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
