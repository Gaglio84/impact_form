import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Forms.css';
import FormOperatori from './FormOperatori';
import FormMediatoriAzione1 from './FormMediatoriAzione1';
import FormCittadinidiPaesiTerziAzione2 from './FormCittadinidiPaesiTerziAzione2';
import FormMediatoriAzione2 from './FormMediatoriAzione2';
import FormCittadinidiPaesiTerziAzione3 from './FormCittadinidiPaesiTerziAzione3';
import FormMediatoriAzione3 from './FormMediatoriAzione3';

export default function Selezione({ user }) {
  const navigate = useNavigate();
  const [azioneSelezionata, setAzioneSelezionata] = useState(null);
  const [sottoazioneSelezionata, setSottoazioneSelezionata] = useState(null);
  const [fondoSelezionato, setFondoSelezionato] = useState(null);
  const [opzioneSelezionata, setOpzioneSelezionata] = useState(null);

  const azioni = [
    {
      id: 1,
      nome: 'Destinatari',
      sottoAzioni: [
        { id: '1A', nome: 'Azione 1', children: ['Operatori', 'Mediatori'] },
        { id: '1B', nome: 'Azione 2', children: ['Cittadini di paesi terzi', 'Mediatori'] },
        { id: '1C', nome: 'Azione 3', children: ['Cittadini di paesi terzi', 'Mediatori'] },
      ],
    },
  ];

  const azioneAttuale = azioni.find(a => a.id === azioneSelezionata);
  const sottoazioneAttuale = azioneAttuale?.sottoAzioni.find(s => s.id === sottoazioneSelezionata);

  if (opzioneSelezionata) {
    if (opzioneSelezionata === 'Operatori') {
      return (
        <FormOperatori 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && sottoazioneAttuale?.id === '1A') {
      return (
        <FormMediatoriAzione1 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Cittadini di paesi terzi' && sottoazioneAttuale?.id === '1B') {
      return (
        <FormCittadinidiPaesiTerziAzione2 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          fondo={fondoSelezionato}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && sottoazioneAttuale?.id === '1B') {
      return (
        <FormMediatoriAzione2 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          fondo={fondoSelezionato}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Cittadini di paesi terzi' && sottoazioneAttuale?.id === '1C') {
      return (
        <FormCittadinidiPaesiTerziAzione3 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          fondo={fondoSelezionato}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && sottoazioneAttuale?.id === '1C') {
      return (
        <FormMediatoriAzione3 
            azione={azioneAttuale?.nome}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          fondo={fondoSelezionato}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
  }

  return (
    <div className="selezione-container">
      <div className="selezione-header">
        <div>
          <h1>Gestione Destinatari</h1>
          {user && <p>Loggato come: <strong>{user.nome_organizzazione}</strong></p>}
        </div>
        <button onClick={() => navigate('/data-entry')} className="btn-back-menu">
          ← Torna al Menu
        </button>
      </div>

      <div className="selezione-content">
        {!azioneSelezionata && (
          <div className="selection-step">
            <h2>Seleziona l'Azione</h2>
            <div className="options-grid">
              {azioni.map((azione) => (
                <div
                  key={azione.id}
                  className="option-card"
                  onClick={() => {
                    setAzioneSelezionata(azione.id);
                    setSottoazioneSelezionata(null);
                  }}
                >
                  <h3>{azione.nome}</h3>
                  <p>{azione.sottoAzioni.length} azioni disponibili</p>
                  <button>Seleziona →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {azioneSelezionata && !sottoazioneSelezionata && (
          <div className="selection-step">
            <h2>Seleziona l'Azione Specifica</h2>
            <div className="options-grid">
              {azioneAttuale?.sottoAzioni.map((sotto) => (
                <div
                  key={sotto.id}
                  className="option-card"
                  onClick={() => setSottoazioneSelezionata(sotto.id)}
                >
                  <h3>{sotto.nome}</h3>
                  <p>{sotto.children.length} opzioni disponibili</p>
                  <button>Seleziona →</button>
                </div>
              ))}
            </div>
            <button onClick={() => setAzioneSelezionata(null)} className="btn-back">
              ← Indietro
            </button>
          </div>
        )}

        {sottoazioneAttuale && azioneAttuale?.id === 1 && sottoazioneAttuale.id === '1B' && !fondoSelezionato && (
          <div className="selection-step">
            <h2>Seleziona il Fondo per {sottoazioneAttuale.nome}</h2>
            <div className="options-grid">
              <div className="option-card" onClick={() => setFondoSelezionato('FAMI')}>
                <h3>FAMI</h3>
                <p>Fondo Asilo Migrazione e Integrazione</p>
                <button>Seleziona →</button>
              </div>
              <div className="option-card" onClick={() => setFondoSelezionato('FESR')}>
                <h3>FESR</h3>
                <p>Fondo Europeo Sviluppo Regionale</p>
                <button>Seleziona →</button>
              </div>
            </div>
            <button onClick={() => setSottoazioneSelezionata(null)} className="btn-back">
              ← Indietro
            </button>
          </div>
        )}

        {sottoazioneAttuale && (azioneAttuale?.id !== 1 || sottoazioneAttuale.id !== '1B' || fondoSelezionato) && (
          <div className="selection-step">
            <h2>Seleziona il Tipo di Destinatario</h2>
            <div className="options-grid">
              {sottoazioneAttuale.children.map((child) => (
                <div
                  key={child}
                  className="option-card"
                  onClick={() => setOpzioneSelezionata(child)}
                >
                  <h3>{child}</h3>
                  <button>Accedi →</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSottoazioneSelezionata(null);
                setFondoSelezionato(null);
              }}
              className="btn-back"
            >
              ← Indietro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}