import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Forms.css';
import '../styles/global.css';

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { azione: azioneParam } = useParams();
  const azioneId = isNaN(parseInt(azioneParam)) ? azioneParam : parseInt(azioneParam);
  
  const [tab, setTab] = useState('lista'); // 'lista' o 'crea'
  const [attività, setAttività] = useState([]);
  const [destinatari, setDestinatari] = useState([]);
  const [loading, setLoading] = useState(false);

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
  
  // Paginazione e ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Ricerca destinatari
  const [searchDestinatari, setSearchDestinatari] = useState('');
  
  // Modalità view a destra
  const [rightPanelMode, setRightPanelMode] = useState(null); // null, 'destinatari', 'modifica'
  const [editingAttivitaTemp, setEditingAttivitaTemp] = useState(null);

  // Carica attività dell'utente al montaggio
  useEffect(() => {
    if (azioneId) {
      caricaAttività(azioneId);
      if (azioneId !== 'fes') {
        caricaDestinatari(azioneId);
      } else {
        caricaDestinatari(4); // FES in DB è 4
      }
    }
  }, [azioneId]);

  const caricaAttività = async (azioneIdParam) => {
    try {
      let query = supabase
        .from('attività_formative')
        .select('id, tipo_attivita, data_inizio, data_fine, durata_ore, numero_partecipanti, azione, created_at')
        .eq('user_id', user.id);
      
      // Filtra per azione
      if (azioneIdParam === 'fes') {
        query = query.eq('azione', 4); // FES in DB è 4
      } else {
        query = query.eq('azione', azioneIdParam);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAttività(data || []);
    } catch (err) {
      console.error('Errore caricamento attività:', err);
    }
  };

  const caricaDestinatari = async (azioneNum) => {
    try {
      // Validazione: se azioneNum è NaN o undefined, esci
      if (!azioneNum && azioneNum !== 0) {
        console.warn('azioneNum non valido:', azioneNum);
        return;
      }

      const tableQuery = azioneNum === 1 ? 'azioni1' : 'azioni23';
      
      let query = supabase
        .from(tableQuery)
        .select('id, nome, cognome, email, azione');
      
      // Se è Azione 1, carica solo Azione 1
      // Se è Azione 2, 3, o FES (4), carica destinatari di tutte e tre
      if (azioneNum === 1) {
        query = query.eq('azione', 1);
      } else {
        // Per azioni 2, 3, FES (4) - carica tutti i destinatari di queste tre
        query = query.in('azione', [2, 3, 4]);
      }
      
      const { data, error } = await query.order('cognome', { ascending: true });

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
      // CREATE
      const { data, error } = await supabase
        .from('attività_formative')
        .insert([
          {
            ...formData,
            azione: azioneId === 'fes' ? 4 : azioneId, // Converti 'fes' in 4 per DB
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      alert('Attività creata con successo!');

      setFormData({ data_inizio: '', data_fine: '', tipo_attivita: '', durata_ore: '', numero_partecipanti: '' });
      caricaAttività(azioneId);
      setTab('lista');
    } catch (err) {
      alert('Errore: ' + err.message);
      console.error(err);
    }

    setLoading(false);
  };

  const handleSelectAttività = async (att) => {
    console.log('Attività selezionata:', att);
    setSelectedAttività(att);
    setAssociazioniLoaded(false);
    
    // Carica solo i destinatari dell'azione corretta
    console.log('Caricamento destinatari per azione:', att.azione);
    await caricaDestinatari(att.azione);

    try {
      const tableName = getDestinatariTable(att.azione);
      console.log('Caricamento associazioni da tabella:', tableName, 'per attività:', att.id);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('destinatario_id')
        .eq('attività_id', att.id);

      if (error) {
        console.error('Errore query associazioni:', error);
        throw error;
      }

      console.log('Associazioni trovate:', data);
      const ids = new Set(data ? data.map((d) => d.destinatario_id) : []);
      setSelectedDestinatari(ids);
      setAssociazioniLoaded(true);
    } catch (err) {
      console.error('Errore caricamento associazioni:', err);
      // Mostra il pannello comunque, anche senza associazioni precedenti
      setSelectedDestinatari(new Set());
      setAssociazioniLoaded(true);
    }
  };

  const handleToggleDestinatario = async (destinatarioId) => {
    const newSet = new Set(selectedDestinatari);
    const tableName = getDestinatariTable(selectedAttività.azione);

    if (newSet.has(destinatarioId)) {
      // Rimuovi associazione
      newSet.delete(destinatarioId);
      try {
        await supabase
          .from(tableName)
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
        await supabase.from(tableName).insert([
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

  // Filtra attività per ricerca e calcola paginazione
  const filteredAttività = attività.filter(att =>
    att.tipo_attivita.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredAttività.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAttività = filteredAttività.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset pagina quando cambia ricerca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Determina la tabella in base all'azione
  const getDestinatariTable = (azione) => {
    return azione === 1 ? 'destinatari_attività_azione1' : 'destinatari_attività_azione23';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Impact Dashboard</h1>
          <p>Benvenuto, {user.nome_organizzazione}</p>
        </div>
        {(
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/data-entry')} className="btn-logout-secondary">
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
          }}
        >
          Crea Attività
        </button>
      </div>

      {tab === 'lista' && (
        <div className="dashboard-content" style={{ display: 'flex', gap: '20px' }}>
          
          {/* LEFT PANEL - Activity List (Compact) */}
          <div className="attività-list" style={{ flex: '0 0 30%', overflowY: 'auto', maxHeight: '80vh' }}>
            <h2>Le mie Attività</h2>
            
            {/* Search Input */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {filteredAttività.length === 0 ? (
              <p className="no-data">Nessuna attività trovata</p>
            ) : (
              <>
                {paginatedAttività.map((att) => (
                  <div
                    key={att.id}
                    className="attività-item"
                  >
                    {/* Activity Info */}
                    <div
                      className="attività-info"
                      onClick={() => handleSelectAttività(att)}
                    >
                      <h4>{att.tipo_attivita}</h4>
                      <small>Durata: {att.durata_ore}h | {att.data_inizio}</small>
                    </div>

                    {/* Action Buttons */}
                    <div className="attività-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAttività(att);
                          setRightPanelMode('destinatari');
                        }}
                        className="btn-action btn-action-associate"
                      >
                        Associa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAttivitaTemp(JSON.parse(JSON.stringify(att)));
                          setRightPanelMode('modifica');
                        }}
                        className="btn-action btn-action-edit"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAttività(att.id);
                        }}
                        className="btn-action btn-action-delete"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ←
                    </button>
                    <small className="pagination-info">{currentPage}/{totalPages}</small>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT PANEL - Associa Destinatari */}
          {rightPanelMode === 'destinatari' && selectedAttività && associazioniLoaded && (
            <div className="attività-details">
              <h3>{selectedAttività.tipo_attivita}</h3>
              <small className="attività-details-header">Durata: {selectedAttività.durata_ore}h | Partecipanti: {selectedAttività.numero_partecipanti}</small>
              
              <h4>Associa Destinatari</h4>
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Cerca per nome o cognome..."
                value={searchDestinatari}
                onChange={(e) => setSearchDestinatari(e.target.value)}
                className="search-input"
              />
              
              <div className="destinatari-list">
                {destinatari.filter(dest =>
                  `${dest.cognome} ${dest.nome}`.toLowerCase().includes(searchDestinatari.toLowerCase())
                ).length === 0 ? (
                  <p>Nessun destinatario trovato</p>
                ) : (
                  destinatari
                    .filter(dest =>
                      `${dest.cognome} ${dest.nome}`.toLowerCase().includes(searchDestinatari.toLowerCase())
                    )
                    .map((dest) => (
                      <label key={dest.id} className="destinatario-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedDestinatari.has(dest.id)}
                          onChange={() => handleToggleDestinatario(dest.id)}
                        />
                        <span>{dest.cognome} {dest.nome}</span>
                      </label>
                    ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    alert('Destinatari associati con successo!');
                    setSelectedDestinatari(new Set());
                    setSearchDestinatari('');
                    setRightPanelMode(null);
                  }}
                  className="btn-primary"
                >
                  Salva Associazioni
                </button>
                <button
                  onClick={() => {
                    setSelectedDestinatari(new Set());
                    setSearchDestinatari('');
                    setRightPanelMode(null);
                  }}
                  className="btn-secondary"
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL - Modifica Attività (FUORI dal flex container) */}
      {rightPanelMode === 'modifica' && editingAttivitaTemp && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h2>Modifica Attività</h2>
              <button
                onClick={() => {
                  setRightPanelMode(null);
                  setEditingAttivitaTemp(null);
                }}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Content - scrollabile solo il contenuto, NON i bottoni */}
            <div className="modal-body">
              {/* Tipo Attività */}
              <div className="form-group-small">
                <label>Tipo di Attività</label>
                <select
                  value={editingAttivitaTemp.tipo_attivita || ''}
                  onChange={(e) => setEditingAttivitaTemp({ ...editingAttivitaTemp, tipo_attivita: e.target.value })}
                >
                  <option value="">-- Seleziona --</option>
                  {(Number(editingAttivitaTemp.azione) === 1 || !editingAttivitaTemp.azione) && (
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
                  {(Number(editingAttivitaTemp.azione) === 2 || !editingAttivitaTemp.azione) && (
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
                  {(Number(editingAttivitaTemp.azione) === 3 || !editingAttivitaTemp.azione) && (
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
              
              {/* Dates */}
              <div className="form-group-row">
                <div className="form-group-small">
                  <label>Data Inizio</label>
                  <input type="date" value={editingAttivitaTemp.data_inizio} onChange={(e) => setEditingAttivitaTemp({ ...editingAttivitaTemp, data_inizio: e.target.value })} />
                </div>
                <div className="form-group-small">
                  <label>Data Fine</label>
                  <input type="date" value={editingAttivitaTemp.data_fine} onChange={(e) => setEditingAttivitaTemp({ ...editingAttivitaTemp, data_fine: e.target.value })} />
                </div>
              </div>
              
              {/* Duration and Participants */}
              <div className="form-group-row">
                <div className="form-group-small">
                  <label>Durata (ore)</label>
                  <input type="number" min="0" value={editingAttivitaTemp.durata_ore} onChange={(e) => setEditingAttivitaTemp({ ...editingAttivitaTemp, durata_ore: e.target.value })} />
                </div>
                <div className="form-group-small">
                  <label>Partecipanti</label>
                  <input type="number" min="0" value={editingAttivitaTemp.numero_partecipanti} onChange={(e) => setEditingAttivitaTemp({ ...editingAttivitaTemp, numero_partecipanti: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Footer - Pulsanti non scrollabili */}
            <div className="modal-footer">
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('attività_formative')
                      .update({
                        tipo_attivita: editingAttivitaTemp.tipo_attivita,
                        data_inizio: editingAttivitaTemp.data_inizio,
                        data_fine: editingAttivitaTemp.data_fine,
                        durata_ore: editingAttivitaTemp.durata_ore,
                        numero_partecipanti: editingAttivitaTemp.numero_partecipanti,
                      })
                      .eq('id', editingAttivitaTemp.id);
                    
                    if (error) throw error;
                    alert('Attività aggiornata!');
                    caricaAttività();
                    setRightPanelMode(null);
                    setEditingAttivitaTemp(null);
                  } catch (err) {
                    alert('Errore: ' + err.message);
                  }
                }}
                className="btn-info"
              >
                Salva
              </button>
              <button
                onClick={() => {
                  setRightPanelMode(null);
                  setEditingAttivitaTemp(null);
                }}
                className="btn-secondary"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'crea' && (
        <div className="dashboard-content">
          <div className="crea-attività-form">
            <div className="form-header">
              <button
                className="btn-back"
                onClick={() => {
                  setFormData({ data_inizio: '', data_fine: '', tipo_attivita: '', durata_ore: '', numero_partecipanti: '' });
                  navigate('/data-entry');
                }}
              >
                ← Indietro
              </button>
              <h2>Crea Attività - {azioneId === 'fes' ? 'FES' : `Azione ${azioneId}`}</h2>
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
                  {!formData.tipo_attivita && <option value="">-- Seleziona --</option>}
                  {azioneId === 1 && (
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
                  {azioneId === 2 && (
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
                  {azioneId === 3 && (
                    <>
                      <option value="Promozione informazione integrata">Interventi per la promozione di un'informazione integrata</option>
                      <option value="Promozione informazione">Attività di promozione dell'informazione</option>
                      <option value="Coinvolgimento cittadini migranti">Attività finalizzate al coinvolgimento attivo dei cittadini migranti e delle loro associazioni</option>
                      <option value="Promozione dello sport">Promozione dello sport</option>
                      <option value="Qualificazione associazioni migranti">Interventi di affiancamento, formazione e qualificazione delle associazioni dei migranti</option>
                    </>
                  )}
                  {azioneId === 'fes' && (
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
        </div>
      )}

      {/* Modale removed - now using side-by-side layout */}
    </div>
  );
}
