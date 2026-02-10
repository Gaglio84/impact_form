import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Forms.css';

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('lista'); // 'lista' o 'crea'
  const [attività, setAttività] = useState([]);
  const [destinatari, setDestinatari] = useState([]);
  const [loading, setLoading] = useState(false);
  const [azioneSelezionata, setAzioneSelezionata] = useState(null);

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
        {!(tab === 'crea' && !azioneSelezionata) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/data-entry')} className="btn-logout" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'white' }}>
              ← Torna al Menu
            </button>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
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
          onClick={() => {
            setTab('crea');
            setAzioneSelezionata(null);
          }}
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
          {!azioneSelezionata ? (
            <div className="selection-step">
              <h2>Seleziona l'Azione</h2>
              <p>Scegli per quale Azione desideri creare la formazione</p>
              <div className="options-grid">
                {['Azione 1', 'Azione 2', 'Azione 3'].map((azione) => (
                  <button
                    key={azione}
                    className="option-card"
                    onClick={() => setAzioneSelezionata(azione)}
                  >
                    <span className="option-icon">📚</span>
                    <span className="option-label">{azione}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="crea-attività-form">
              <div className="form-header">
                <button
                  className="btn-back"
                  onClick={() => setAzioneSelezionata(null)}
                >
                  ← Indietro
                </button>
                <h2>Crea Attività - {azioneSelezionata}</h2>
              </div>
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
          )}
        </div>
      )}
    </div>
  );
}
