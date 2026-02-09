import React, { useState } from 'react';
import './Forms.css';
import { supabase } from '../supabaseClient';

function Button({ children, onClick, style, type = 'button', variant = 'primary' }) {
  const baseClass = 'form-button';
  const variantClass = variant === 'primary' ? 'form-button-primary' : 'form-button-secondary';
  return <button type={type} onClick={onClick} className={`${baseClass} ${variantClass}`} style={style}>{children}</button>;
}

export default function FormOperatori({ azione, sottoazione, opzione, onIndietro }) {
  const [formData, setFormData] = useState({
    cf: '',
    nome: '',
    cognome: '',
    dataNascita: '',
    genere: '',
    enteAppartenenza: '',
    tipologiaEnte: '',
    entePubblico: '',
    telefono: '',
    email: '',
    dataInizioSupporto: '',
    dataFineSupporto: '',
    capacityBuildingPrefetture: '',
    capacityBuildingEntiLocali: '',
    formazioneScuole: '',
    formazioneDiscriminazioni: '',
    formazioneSocioSanitariaOS2: '',
    formazioneTutelaVolontaria: '',
    formazioneTutelaMinori: '',
    utilitaFormazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    utilizzoCompetenze: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    esitoAttivita: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    soddisfazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    utilitaSensibilizzazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: inputType === 'checkbox' ? checked : value 
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const isProjectEnded = formData.dataFineSupporto && new Date(formData.dataFineSupporto) < new Date(today);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datiCompleti = {
      tipo: 'Operatore',
      ...formData
    };
    
    try {
      const { data, error } = await supabase
        .from('azione1')
        .insert([datiCompleti]);
      
      if (error) {
        console.error('Errore Supabase:', error);
        alert('Errore nel salvataggio: ' + error.message);
      } else {
        alert('Form inviato con successo!');
        // Reset form
        setFormData({
          cf: '',
          nome: '',
          cognome: '',
          dataNascita: '',
          genere: '',
          enteAppartenenza: '',
          tipologiaEnte: '',
          entePubblico: '',
          telefono: '',
          email: '',
          dataInizioSupporto: '',
          dataFineSupporto: '',
          capacityBuildingPrefetture: '',
          capacityBuildingEntiLocali: '',
          formazioneScuole: '',
          formazioneDiscriminazioni: '',
          formazioneSocioSanitariaOS2: '',
          formazioneTutelaVolontaria: '',
          formazioneTutelaMinori: '',
          utilitaFormazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          utilizzoCompetenze: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          esitoAttivita: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          soddisfazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          utilitaSensibilizzazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
        });
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore nel salvataggio: ' + error.message);
    }
  };

  const esito = ['Risultato non ancora verificabile (supporto in corso) / Non applicabile', 'Risultato positivo', 'Risultato negativo'];

  return (
    <div className="app">
      <h1>Scheda Operatori</h1>
      <p><strong> {azione}</strong></p>
      <p><strong> {sottoazione}</strong></p>
      <p><strong>{opzione}</strong></p>

      <form onSubmit={handleSubmit} className="form-container">
        
        <div className="form-section">
          <h3 className="form-section-title">Dati Personali</h3>
          
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="text" name="cf" placeholder="Codice Fiscale" value={formData.cf} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <select name="genere" value={formData.genere} onChange={handleChange} className="form-select">
                  <option value="">Genere</option>
                  <option value="donna">Donna</option>
                  <option value="uomo">Uomo</option>
                  <option value="non-binario">Non binario</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required className="form-input" />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="text" name="cognome" placeholder="Cognome" value={formData.cognome} onChange={handleChange} required className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="date" name="dataNascita" placeholder="Data di nascita" value={formData.dataNascita} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="tel" name="telefono" placeholder="Telefono" value={formData.telefono} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="text" name="enteAppartenenza" placeholder="Ente di appartenenza" value={formData.enteAppartenenza} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <select name="tipologiaEnte" value={formData.tipologiaEnte} onChange={handleChange} className="form-select">
                  <option value="">Tipologia di ente</option>
                  <option value="pubblico">Pubblico</option>
                  <option value="privato">Privato</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="text" name="entePubblico" placeholder="Ente pubblico presso il quale si opera" value={formData.entePubblico} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Periodi di Supporto</h3>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="date" name="dataInizioSupporto" placeholder="Data inizio supporto" value={formData.dataInizioSupporto} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="date" name="dataFineSupporto" placeholder="Data fine supporto" value={formData.dataFineSupporto} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">OS2 - Capacity Building e Formazione</h3>
          
          <div className="form-table-group">
          <div className="form-table-row">
            <label className="form-label">Capacity building del personale operante nelle Prefetture (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="capacityBuildingPrefetture" value="si" checked={formData.capacityBuildingPrefetture === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="capacityBuildingPrefetture" value="no" checked={formData.capacityBuildingPrefetture === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Capacity building del personale operante negli Enti locali (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="capacityBuildingEntiLocali" value="si" checked={formData.capacityBuildingEntiLocali === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="capacityBuildingEntiLocali" value="no" checked={formData.capacityBuildingEntiLocali === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Formazione personale scuole (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="formazioneScuole" value="si" checked={formData.formazioneScuole === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="formazioneScuole" value="no" checked={formData.formazioneScuole === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Formazione per la prevenzione e il contrasto alle discriminazioni (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="formazioneDiscriminazioni" value="si" checked={formData.formazioneDiscriminazioni === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="formazioneDiscriminazioni" value="no" checked={formData.formazioneDiscriminazioni === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Formazione personale servizi socio-sanitari (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="formazioneSocioSanitariaOS2" value="si" checked={formData.formazioneSocioSanitariaOS2 === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="formazioneSocioSanitariaOS2" value="no" checked={formData.formazioneSocioSanitariaOS2 === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Formazione per la tutela volontaria dei MSNA (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="formazioneTutelaVolontaria" value="si" checked={formData.formazioneTutelaVolontaria === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="formazioneTutelaVolontaria" value="no" checked={formData.formazioneTutelaVolontaria === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          <div className="form-table-row">
            <label className="form-label">Formazione per la tutela dei minori stranieri sottoposti a provvedimenti della Autorità Giudiziaria (O.2.2.a)</label>
            <div className="form-radio-group">
              <label>
                <input type="radio" name="formazioneTutelaMinori" value="si" checked={formData.formazioneTutelaMinori === 'si'} onChange={handleChange} />
                Si
              </label>
              <label>
                <input type="radio" name="formazioneTutelaMinori" value="no" checked={formData.formazioneTutelaMinori === 'no'} onChange={handleChange} />
                No
              </label>
            </div>
          </div>
        </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Esiti e Valutazione</h3>

          <div className="form-table-row">
            <label className="form-label">Esito positivo attività formative (R.1.1.p; R.2.12.a; R.2.11.p; R.3.7.a)</label>
            <select name="esitoAttivita" value={formData.esitoAttivita} onChange={handleChange} className="form-select" disabled={!isProjectEnded} title="Compilabile solo se la Data fine supporto è nel passato">
              <option value="">-- Seleziona --</option>
              {esito.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="form-table-row">
            <label className="form-label">Soddisfazione (R.1.2.s; R.2.16.a; R.2.14.s; R.2.12.p)</label>
            <select name="soddisfazione" value={formData.soddisfazione} onChange={handleChange} className="form-select" disabled={!isProjectEnded} title="Compilabile solo se la Data fine supporto è nel passato">
              <option value="">-- Seleziona --</option>
              {esito.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="form-button-group">
          <Button type="submit" variant="primary">Invia</Button>
          <Button onClick={onIndietro} variant="secondary">Indietro</Button>
        </div>
      </form>
    </div>
  );
}
