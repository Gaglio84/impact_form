import React, { useState } from 'react';
import '../App.css';
import FormOperatori from './FormOperatori';
import FormMediatoriAzione1 from './FormMediatoriAzione1';
import FormCittadinidiPaesiTerziAzione2 from './FormCittadinidiPaesiTerziAzione2';
import FormMediatoriAzione2 from './FormMediatoriAzione2';
import FormCittadinidiPaesiTerziAzione3 from './FormCittadinidiPaesiTerziAzione3';
import FormMediatoriAzione3 from './FormMediatoriAzione3';

function Button({ children, onClick }) {
  return <button onClick={onClick} style={{ padding: '1em 2em', fontSize: '1.1em', margin: '0.5em' }}>{children}</button>;
}

export default function Selezione() {
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
    {
      id: 2,
      nome: 'Attività formative',
      sottoAzioni: [
        { id: '2A', nome: 'Azione 1', children: ['Opzione 2A1', 'Opzione 2A2'] },
        { id: '2B', nome: 'Azione 2', children: ['Opzione 2B1', 'Opzione 2B2', 'Opzione 2B3'] },
        { id: '2C', nome: 'Azione 3', children: ['Opzione 2C1', 'Opzione 2C2'] },
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
    <div className="app">
      <h1>Seleziona l'AZIONE in cui vuoi inserire i dati</h1>
      {azioni.map((azione) => (
        <Button key={azione.id} onClick={() => { setAzioneSelezionata(azione.id); setSottoazioneSelezionata(null); }}>
          {azione.nome}
        </Button>
      ))}

      {azioneSelezionata !== null && sottoazioneSelezionata === null && (
        <div style={{ marginTop: '2em', borderTop: '2px solid #ccc', paddingTop: '2em' }}>
          <h2>Seleziona una sottoazione</h2>
          {azioneAttuale?.sottoAzioni.map((sotto) => (
            <Button key={sotto.id} onClick={() => setSottoazioneSelezionata(sotto.id)}>
              {sotto.nome}
            </Button>
          ))}
          <div style={{ marginTop: '2em' }}>
            <Button onClick={() => setAzioneSelezionata(null)} style={{ padding: '1em 2em', fontSize: '1.1em', margin: '0.5em', background: '#999' }}>
              Indietro
            </Button>
          </div>
        </div>
      )}

      {sottoazioneAttuale && azioneAttuale?.id === 1 && sottoazioneAttuale.id === '1B' && !fondoSelezionato && (
        <div style={{ marginTop: '2em', borderTop: '2px solid #ccc', paddingTop: '2em' }}>
          <h2>Seleziona il fondo per {sottoazioneAttuale.nome}</h2>
          <Button onClick={() => setFondoSelezionato('FAMI')}>FAMI</Button>
          <Button onClick={() => setFondoSelezionato('FESR')}>FESR</Button>
          <div style={{ marginTop: '2em' }}>
            <Button onClick={() => setSottoazioneSelezionata(null)} style={{ padding: '1em 2em', fontSize: '1.1em', margin: '0.5em', background: '#999' }}>
              Indietro
            </Button>
          </div>
        </div>
      )}

      {sottoazioneAttuale && (azioneAttuale?.id !== 1 || sottoazioneAttuale.id !== '1B' || fondoSelezionato) && (
        <div style={{ marginTop: '2em', borderTop: '2px solid #ccc', paddingTop: '2em' }}>
          <h2>Seleziona un'opzione per {sottoazioneAttuale.nome}</h2>
          {sottoazioneAttuale.children.map((child) => (
            <Button key={child} onClick={() => setOpzioneSelezionata(child)}>{child}</Button>
          ))}
          <div style={{ marginTop: '2em' }}>
            <Button onClick={() => { setSottoazioneSelezionata(null); setFondoSelezionato(null); }} style={{ padding: '1em 2em', fontSize: '1.1em', margin: '0.5em', background: '#999' }}>
              Indietro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}