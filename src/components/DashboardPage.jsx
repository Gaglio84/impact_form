import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Forms.css';

export default function DashboardPage({ user, onLogout }) {
  const [tab, setTab] = useState('lista'); // 'lista' o 'crea'
  const [attività, setAttività] = useState([]);
  const [destinatari, setDestinatari] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form per creare attività
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    data_inizio: '',
    data_fine: '',
  });

  // Tab gestione attività
  const [selectedAttività, setSelectedAttività] = useState(null);
  const [selectedDestinatari, setSelectedDestinatari] = useState(new Set());
  const [associazioniLoaded, setAssociazioniLoaded] = useState(false);

  // Carica attività dell'utente al montaggio
  useEffect(() => {
    caricaAttività();
    caricaDestinatari();
  }, []);

  const caricaAttività = async () => {
    try {
      const { data, error } = await supabase
        .from('attività_formative')
        .select('id, nome, descrizione, data_inizio, data_fine, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttività(data || []);
    } catch (err) {
      console.error('Errore caricamento attività:', err);
    }
  };

  const caricaDestinatari = async () => {
    try {
      const { data, error } = await supabase
        .from('azioni23')
        .select('id, nome, cognome, email')
        .order('cognome', { ascending: true });

      if (error) throw error;
      setDestinatari(data || []);
    } catch (err) {
      console.error('Errore caricamento destinatari:', err);
    }
  };

  const handleCreateAttività = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('attività_formative')
        .insert([
          {
            ...formData,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      alert('Attività creata con successo!');
      setFormData({ nome: '', descrizione: '', data_inizio: '', data_fine: '' });
      caricaAttività();
      setTab('lista');
    } catch (err) {
      alert('Errore nella creazione: ' + err.message);
      console.error(err);
    }

    setLoading(false);
  };

  const handleSelectAttività = async (att) => {
    setSelectedAttività(att);
    setAssociazioniLoaded(false);

    try {
      const { data, error } = await supabase
        .from('destinatari_attività')
        .select('destinatario_id')
        .eq('attività_id', att.id);

      if (error) throw error;

      const ids = new Set(data.map((d) => d.destinatario_id));
      setSelectedDestinatari(ids);
      setAssociazioniLoaded(true);
    } catch (err) {
      console.error('Errore caricamento associazioni:', err);
    }
  };

  const handleToggleDestinatario = async (destinatarioId) => {
    const newSet = new Set(selectedDestinatari);

    if (newSet.has(destinatarioId)) {
      // Rimuovi associazione
      newSet.delete(destinatarioId);
      try {
        await supabase
          .from('destinatari_attività')
          .delete()
          .eq('attività_id', selectedAttività.id)
          .eq('destinatario_id', destinatarioId);
      } catch (err) {
        console.error('Errore rimozione associazione:', err);
      }
    } else {
      // Aggiungi associazione
      newSet.add(destinatarioId);
      try {
        await supabase.from('destinatari_attività').insert([
          {
            attività_id: selectedAttività.id,
            destinatario_id: destinatarioId,
          },
        ]);
      } catch (err) {
        console.error('Errore aggiunta associazione:', err);
      }
    }

    setSelectedDestinatari(newSet);
  };

  const handleDeleteAttività = async (attivitàId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa attività?')) return;

    try {
      await supabase.from('attività_formative').delete().eq('id', attivitàId);
      alert('Attività eliminata');
      caricaAttività();
      setSelectedAttività(null);
    } catch (err) {
      alert('Errore eliminazione: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Impact Dashboard</h1>
          <p>Benvenuto, {user.nome_organizzazione}</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${tab === 'lista' ? 'active' : ''}`}
          onClick={() => setTab('lista')}
        >
          Le mie Attività ({attività.length})
        </button>
        <button
          className={`tab-btn ${tab === 'crea' ? 'active' : ''}`}
          onClick={() => setTab('crea')}
        >
          Crea Attività
        </button>
      </div>

      {tab === 'lista' && (
        <div className="dashboard-content">
          <div className="attività-list">
            <h2>Attività Formative</h2>
            {attività.length === 0 ? (
              <p className="no-data">Nessuna attività creata</p>
            ) : (
              attività.map((att) => (
                <div
                  key={att.id}
                  className={`attività-item ${
                    selectedAttività?.id === att.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectAttività(att)}
                >
                  <div className="attività-info">
                    <h3>{att.nome}</h3>
                    <p>{att.descrizione}</p>
                    <small>
                      {att.data_inizio} {att.data_fine && `- ${att.data_fine}`}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedAttività && associazioniLoaded && (
            <div className="attività-details">
              <h2>{selectedAttività.nome}</h2>
              <p className="attività-desc">{selectedAttività.descrizione}</p>
              <div className="date-range">
                <strong>Dal {selectedAttività.data_inizio}</strong>
                {selectedAttività.data_fine && (
                  <strong> al {selectedAttività.data_fine}</strong>
                )}
              </div>

              <h3>Associa Destinatari</h3>
              <div className="destinatari-list">
                {destinatari.length === 0 ? (
                  <p>Nessun destinatario disponibile</p>
                ) : (
                  destinatari.map((dest) => (
                    <label key={dest.id} className="destinatario-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedDestinatari.has(dest.id)}
                        onChange={() => handleToggleDestinatario(dest.id)}
                      />
                      <span>
                        {dest.cognome} {dest.nome}
                        {dest.email && <small>({dest.email})</small>}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <div className="attività-actions">
                <button
                  onClick={() => handleDeleteAttività(selectedAttività.id)}
                  className="btn-delete"
                >
                  Elimina Attività
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'crea' && (
        <div className="dashboard-content">
          <div className="crea-attività-form">
            <h2>Crea Nuova Attività Formativa</h2>
            <form onSubmit={handleCreateAttività}>
              <div className="form-group">
                <label htmlFor="nome">Nome Attività *</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descrizione">Descrizione</label>
                <textarea
                  id="descrizione"
                  value={formData.descrizione}
                  onChange={(e) =>
                    setFormData({ ...formData, descrizione: e.target.value })
                  }
                  className="form-input"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="data_inizio">Data Inizio *</label>
                  <input
                    type="date"
                    id="data_inizio"
                    value={formData.data_inizio}
                    onChange={(e) =>
                      setFormData({ ...formData, data_inizio: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="data_fine">Data Fine</label>
                  <input
                    type="date"
                    id="data_fine"
                    value={formData.data_fine}
                    onChange={(e) =>
                      setFormData({ ...formData, data_fine: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Creazione in corso...' : 'Crea Attività'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 28px;
        }

        .dashboard-header p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .btn-logout {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }

        .btn-logout:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .dashboard-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #ddd;
        }

        .tab-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab-btn:hover {
          color: #667eea;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .attività-list {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .attività-list h2 {
          margin-top: 0;
          color: #333;
        }

        .no-data {
          color: #999;
          text-align: center;
          padding: 20px;
        }

        .attività-item {
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 5px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .attività-item:hover {
          border-color: #667eea;
          background-color: #f9f9f9;
        }

        .attività-item.selected {
          border-color: #667eea;
          background-color: #f0f4ff;
        }

        .attività-info h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 16px;
        }

        .attività-info p {
          margin: 5px 0;
          color: #666;
          font-size: 13px;
        }

        .attività-details {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-height: 600px;
          overflow-y: auto;
        }

        .attività-details h2 {
          margin-top: 0;
          color: #333;
        }

        .attività-desc {
          color: #666;
          margin: 10px 0;
        }

        .date-range {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
          font-size: 14px;
        }

        .destinatari-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
        }

        .destinatario-checkbox {
          display: flex;
          align-items: center;
          padding: 8px;
          cursor: pointer;
          user-select: none;
        }

        .destinatario-checkbox input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .destinatario-checkbox span {
          font-size: 14px;
          color: #333;
        }

        .destinatario-checkbox small {
          margin-left: 5px;
          color: #999;
          font-size: 12px;
        }

        .attività-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .btn-delete {
          background-color: #dc3545;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .btn-delete:hover {
          background-color: #c82333;
        }

        .crea-attività-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          grid-column: 1 / -1;
          max-width: 600px;
        }

        .crea-attività-form h2 {
          margin-top: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background-color: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 20px;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #5568d3;
        }

        .btn-submit:disabled {
          background-color: #999;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
