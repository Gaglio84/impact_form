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
    data_inizio: '',
    data_fine: '',
    tipo_attivita: '',
    durata_ore: '',
    numero_partecipanti: '',
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
        .select('id, tipo_attivita, data_inizio, data_fine, durata_ore, numero_partecipanti, azione, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttività(data || []);
    } catch (err) {
      console.error('Errore caricamento attività:', err);
    }
  };

  const caricaDestinatari = async (azioneStr) => {
    try {
      // Estrai il numero da "Azione X" (es: "Azione 1" -> 1)
      const azioneNum = parseInt(azioneStr.split(' ')[1]);
      
      const { data, error } = await supabase
        .from('azioni23')
        .select('id, nome, cognome, email, azione')
        .eq('azione', azioneNum)
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
      // Estrai il numero da "Azione X"
      const azioneNum = parseInt(azioneSelezionata.split(' ')[1]);
      
      const { data, error } = await supabase
        .from('attività_formative')
        .insert([
          {
            ...formData,
            azione: azioneNum,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      alert('Attività creata con successo!');
      setFormData({ data_inizio: '', data_fine: '', tipo_attivita: '', durata_ore: '', numero_partecipanti: '' });
      caricaAttività();
      setAzioneSelezionata(null);
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
    
    // Carica solo i destinatari dell'azione corretta
    await caricaDestinatari(att.azione);

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
                    <h3>{att.tipo_attivita}</h3>
                    <p>Durata: {att.durata_ore} ore | Partecipanti: {att.numero_partecipanti}</p>
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
              <h2>{selectedAttività.tipo_attivita}</h2>
              <p className="attività-desc">Durata: {selectedAttività.durata_ore} ore | Partecipanti: {selectedAttività.numero_partecipanti}</p>
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
              <p>Scegli per quale <strong>Azione</strong> desideri creare l'<strong>Attività formativa</strong></p>
              <div className="options-grid">
                {['Azione 1', 'Azione 2', 'Azione 3'].map((azione) => (
                  <button
                    key={azione}
                    className="option-card"
                    onClick={() => setAzioneSelezionata(azione)}
                  >
                    
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
                  <label htmlFor="tipo_attivita">Tipo di Attività *</label>
                  <select
                    id="tipo_attivita"
                    value={formData.tipo_attivita}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo_attivita: e.target.value })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">-- Seleziona --</option>
                    {azioneSelezionata === 'Azione 1' && (
                      <>
                        <option value="Attivazione e rafforzamento di reti di governance">Attivazione e rafforzamento di reti di governance e coordinamento a livello territoriale</option>
                        <option value="Creazione di Tavoli territoriali">Creazione di Tavoli territoriali</option>
                        <option value="Promozione di partenariati">Promozione di partenariati e/o azioni interregionali</option>
                        <option value="Capacity building operatori">Interventi di capacity building/enforcement rivolti agli operatori</option>
                        <option value="Qualificazione servizi">Interventi per la qualificazione e il potenziamento dei servizi per l'impiego</option>
                        <option value="Mediatore interculturale">Interventi per il coinvolgimento e/o la qualificazione del mediatore interculturale</option>
                        <option value="Ricerca-azione">Interventi di ricerca-azione</option>
                      </>
                    )}
                    {azioneSelezionata === 'Azione 2' && (
                      <>
                        <option value="Inclusione e integrazione stranieri">Interventi di inclusione e integrazione di giovani e adulti stranieri nei percorsi formativi e nelle transizioni tra formazione e inserimento lavorativo</option>
                        <option value="Percorsi formativi non professionalizzanti">Promozione di percorsi formativi "non professionalizzanti"</option>
                        <option value="Competenze linguistiche">Interventi dedicati all'acquisizione delle competenze linguistiche</option>
                        <option value="Alfabetizzazione digitale">Attività per il miglioramento dell'alfabetizzazione digitale per la promozione dell'autonomia</option>
                        <option value="Valorizzazione percorsi">Valorizzazione dei percorsi pregressi</option>
                        <option value="Reti di sostegno territoriale">Attivazione di reti di sostegno territoriale</option>
                        <option value="Contrasto povertà educativa">Azioni di contrasto alla povertà educativa</option>
                        <option value="Contrasto disagio abitativo">Attività finalizzate al contrasto al disagio abitativo dei CPT</option>
                        <option value="Orientamento lavoro">Interventi di orientamento al lavoro e ai servizi per l'impiego</option>
                        <option value="Autoimprenditorialità">Attività rivolte a favorire l'autoimprenditorialità</option>
                        <option value="Matching domanda offerta">Attività rivolte a favorire il matching tra domanda e offerta di lavoro</option>
                        <option value="Conciliazione vita-lavoro">Misure di conciliazione vita-lavoro</option>
                        <option value="Centri multiservizi">Attivazione e/o sostegno di centri multiservizi</option>
                        <option value="Centri per l'Impiego">Sviluppo di azioni sinergiche con Centri per l'Impiego</option>
                        <option value="Outreach">Interventi di outreach</option>
                        <option value="Mediatori interculturali">Attivazione e/o potenziamento della presenza di mediatori interculturali</option>
                      </>
                    )}
                    {azioneSelezionata === 'Azione 3' && (
                      <>
                        <option value="Promozione informazione integrata">Interventi per la promozione di un'informazione integrata</option>
                        <option value="Promozione informazione">Attività di promozione dell'informazione</option>
                        <option value="Coinvolgimento cittadini migranti">Attività finalizzate al coinvolgimento attivo dei cittadini migranti e delle loro associazioni</option>
                        <option value="Promozione dello sport">Promozione dello sport</option>
                        <option value="Qualificazione associazioni migranti">Interventi di affiancamento, formazione e qualificazione delle associazioni dei migranti</option>
                      </>
                    )}
                  </select>
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="durata_ore">Durata in Ore *</label>
                    <input
                      type="number"
                      id="durata_ore"
                      value={formData.durata_ore}
                      onChange={(e) =>
                        setFormData({ ...formData, durata_ore: e.target.value })
                      }
                      className="form-input"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numero_partecipanti">Numero di Partecipanti *</label>
                    <input
                      type="number"
                      id="numero_partecipanti"
                      value={formData.numero_partecipanti}
                      onChange={(e) =>
                        setFormData({ ...formData, numero_partecipanti: e.target.value })
                      }
                      className="form-input"
                      min="0"
                      required
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
