import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { azione: azioneParam } = useParams();
  const azioneId = isNaN(parseInt(azioneParam)) ? azioneParam : parseInt(azioneParam);
  
  const [sottoazioneSelezionata, setSottoazioneSelezionata] = useState(null);
  const [opzioneSelezionata, setOpzioneSelezionata] = useState(null);

  const sottoazioni = {
    1: [
      { id: '1A', nome: 'Azione 1', children: ['Operatori', 'Mediatori'] },
    ],
    2: [
      { id: '2B', nome: 'Azione 2', children: ['Cittadini di paesi terzi', 'Mediatori'] },
    ],
    3: [
      { id: '3C', nome: 'Azione 3', children: ['Cittadini di paesi terzi', 'Mediatori'] },
    ],
    'fes': [
      { id: 'fes-main', nome: 'FES', children: ['Cittadini di paesi terzi', 'Mediatori'] },
    ],
  };

  const sottoazioniAttuale = sottoazioni[azioneId] || [];
  const sottoazioneAttuale = sottoazioniAttuale.find(s => s.id === sottoazioneSelezionata);

  if (opzioneSelezionata) {
    if (opzioneSelezionata === 'Operatori') {
      return (
        <FormOperatori 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && azioneId === 1) {
      return (
        <FormMediatoriAzione1 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Cittadini di paesi terzi' && azioneId === 2) {
      return (
        <FormCittadinidiPaesiTerziAzione2 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && azioneId === 2) {
      return (
        <FormMediatoriAzione2 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Cittadini di paesi terzi' && azioneId === 3) {
      return (
        <FormCittadinidiPaesiTerziAzione3 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && azioneId === 3) {
      return (
        <FormMediatoriAzione3 
          azione={`Azione ${azioneId}`}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Cittadini di paesi terzi' && azioneId === 'fes') {
      return (
        <FormCittadinidiPaesiTerziAzione2 
          azione={`FES`}
          azioneId={4}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
    if (opzioneSelezionata === 'Mediatori' && azioneId === 'fes') {
      return (
        <FormMediatoriAzione2 
          azione={`FES`}
          azioneId={4}
          sottoazione={sottoazioneAttuale?.nome}
          opzione={opzioneSelezionata}
          onIndietro={() => setOpzioneSelezionata(null)}
        />
      );
    }
  }

  return (
    <div className="selezione-container">
      <div className="selezione-header">
        <div>
          <h1>Gestione Destinatari - Azione {azioneId}</h1>
          {user && <p>Loggato come: <strong>{user.nome_organizzazione}</strong></p>}
        </div>
        <button onClick={() => navigate('/data-entry')} className="btn-back-menu">
          ← Torna al Menu
        </button>
      </div>

      <div className="selezione-content">
        {!sottoazioneSelezionata && (
          <div className="selection-step">
            <h2>Seleziona il Tipo di Destinatario per Azione {azioneId}</h2>
            <div className="options-grid">
              {sottoazioni[azioneId]?.[0]?.children.map((child) => (
                <div
                  key={child}
                  className="option-card"
                  onClick={() => {
                    setSottoazioneSelezionata(sottoazioni[azioneId][0].id);
                    setOpzioneSelezionata(child);
                  }}
                >
                  <h3>{child}</h3>
                  <button>Accedi →</button>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/data-entry')} className="btn-back">
              ← Indietro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}