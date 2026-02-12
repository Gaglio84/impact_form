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
        La piattaforma è stata realizzata sulla base degli indicatori di progetto. <br /> 
        Ti consigliamo di consultare la scheda degli indicatori ogni qualvolta tu abbia un dubbio nella compilazione. <br />
         <br /> <h2> <a href={pdfUrl} target="_blank">Scheda Indicatori.pdf</a></h2>
      </p>
      <p>
        Nel caso in cui tu abbia bisogno di assistenza, non esitare a contattare il nostro team di supporto. <br />
      <a href="tel:+39 ">Telefono</a>
        <br /> <a href="mailto: ">Email</a>.
      </p>
      <button onClick={handleButtonClick}>Login</button>
    </div>
  );
}