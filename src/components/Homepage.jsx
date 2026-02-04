import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Homepage() {
  const navigate = useNavigate();
  const pdfUrl = '../public/6._fac-simile_scheda_indicatori_piani_regionali_integrazione.pdf';

  const handleButtonClick = () => {
    navigate('/selezione');
  };

  return (
    <div className="app">
      <h1>Progetto Lab Impact</h1>
      <h2>Benvenuto nella piattaforma di inserimento dati</h2>
      <p>
        Per rendere la tua esperienza nel <em>data entry</em> il più semplice e intuitiva possibile, <br />
        ti guideremo passo dopo passo.
        La piattaforma è stata realizzata sulla base degli indicatori di progetto
        consultabili qui: <br /><a href={pdfUrl} target="_blank">Scheda Indicatori</a>.
      </p>
      <button onClick={handleButtonClick}>Iniziamo</button>
    </div>
  );
}