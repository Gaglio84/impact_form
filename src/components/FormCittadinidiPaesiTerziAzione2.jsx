import React, { useState } from 'react';
import './Forms.css';
import { supabase } from '../supabaseClient';

function Button({ children, onClick, style, type = 'button', variant = 'primary' }) {
  const baseClass = 'form-button';
  const variantClass = variant === 'primary' ? 'form-button-primary' : 'form-button-secondary';
  return <button type={type} onClick={onClick} className={`${baseClass} ${variantClass}`} style={style}>{children}</button>;
}

export default function FormCittadinidiPaesiTerziAzione2({ azione, sottoazione, opzione, fondo, onIndietro }) {
  const [formData, setFormData] = useState({
    cf: '',
    nome: '',
    cognome: '',
    dataNascita: '',
    genere: '',
    nazionalita: '',
    permessoSoggiorno: '',
    note: '',
    targetSpecifico1: '',
    targetSpecifico2: '',
    targetSpecifico3: '',
    titoloStudio: '',
    lavoroPaesOrigine: '',
    telefono: '',
    email: '',
    dataInizioSupporto: '',
    dataFineSupporto: '',
    formazioneLinquistica: '',
    orientamentoProfessionale: '',
    educazioneCivica: '',
    supportoInserimentoScolastico: '',
    supportoFormazioneUniversitaria: '',
    orientamentoFormazione: 'no',
    serviziCaporalato: 'no',
    serviziAlloggiativa: 'no',
    attivitaSensibilizzazione: 'no',
    supportoTutelaVolontaria: 'no',
    supportoMinoriAutoritaGiudiziaria: 'no',
    informazioniRicongiungimento: 'no',
    supportoMobilita: 'no',
    supportoSoggiornanteLungoPeriodo: 'no',
    miglioramentoCompetenzeLinguistiche: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    utilitaFormazioneIntegrazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    presentazioneDomandaQualifiche: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    presentazioneDomandaSoggiornante: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
    soddisfazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
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

  const getTargetOptions = (currentFieldName) => {
    const selectedTargets = [];
    if (currentFieldName !== 'targetSpecifico1' && formData.targetSpecifico1) selectedTargets.push(formData.targetSpecifico1);
    if (currentFieldName !== 'targetSpecifico2' && formData.targetSpecifico2) selectedTargets.push(formData.targetSpecifico2);
    if (currentFieldName !== 'targetSpecifico3' && formData.targetSpecifico3) selectedTargets.push(formData.targetSpecifico3);
    return targetSpecifici.map((target) => (
      <option key={target} value={target} disabled={selectedTargets.includes(target)}>{target}</option>
    ));
  };

  const sanitizeData = (data) => {
    const dateFields = ['dataNascita', 'dataInizioSupporto', 'dataFineSupporto'];
    const sanitized = { ...data };
    dateFields.forEach(field => {
      if (sanitized[field] === '') {
        sanitized[field] = null;
      }
    });
    return sanitized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datiCompleti = {
      azione: 2,
      tipo: 'Cittadini',
      fondo: fondo,
      ...formData
    };
    
    try {
      const { data, error } = await supabase
        .from('azioni23')
        .insert([sanitizeData(datiCompleti)]);
      
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
          nazionalita: '',
          permessoSoggiorno: '',
          note: '',
          targetSpecifico1: '',
          targetSpecifico2: '',
          targetSpecifico3: '',
          titoloStudio: '',
          lavoroPaesOrigine: '',
          telefono: '',
          email: '',
          dataInizioSupporto: '',
          dataFineSupporto: '',
          formazioneLinquistica: '',
          orientamentoProfessionale: '',
          educazioneCivica: '',
          supportoInserimentoScolastico: '',
          supportoFormazioneUniversitaria: '',
          orientamentoFormazione: 'no',
          serviziCaporalato: 'no',
          serviziAlloggiativa: 'no',
          attivitaSensibilizzazione: 'no',
          supportoTutelaVolontaria: 'no',
          supportoMinoriAutoritaGiudiziaria: 'no',
          informazioniRicongiungimento: 'no',
          supportoMobilita: 'no',
          supportoSoggiornanteLungoPeriodo: 'no',
          miglioramentoCompetenzeLinguistiche: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          utilitaFormazioneIntegrazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          presentazioneDomandaQualifiche: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          presentazioneDomandaSoggiornante: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
          soddisfazione: 'Risultato non ancora verificabile (supporto in corso) / Non applicabile',
        });
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore nel salvataggio: ' + error.message);
    }
  };

  const nazionalita = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Antigua e Barbuda', 'Arabia Saudita', 'Argentina', 'Armenia', 'Australia', 'Azerbaigian', 'Bahamas', 'Bahrein', 'Bangladesh', 'Barbados', 'Belize', 'Benin', 'Bhutan', 'Bielorussia', 'Bolivia', 'Bosnia-Erzegovina', 'Botswana', 'Brasile', 'Brunei Darussalam', 'Burkina Faso', 'Burundi', 'Cambogia', 'Camerun', 'Canada', 'Capo Verde', 'Ciad', 'Cile', 'Cina', 'Colombia', 'Comore', 'Congo', 'Corea del Nord', 'Corea del Sud', 'Costa d\'Avorio', 'Costa Rica', 'Cuba', 'Dominica', 'Ecuador', 'Egitto', 'El Salvador', 'Emirati Arabi Uniti', 'Eritrea', 'Eswatini', 'Etiopia', 'Federazione russa', 'Figi', 'Filippine', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Giamaica', 'Giappone', 'Gibuti', 'Giordania', 'Grenada', 'Guatemala', 'Guinea', 'Guinea equatoriale', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran', 'Iraq', 'Islanda', 'Isole Marshall', 'Isole Salomone', 'Israele', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Kosovo', 'Kuwait', 'Laos', 'Lesotho', 'Libano', 'Liberia', 'Libia', 'Macedonia del Nord', 'Madagascar', 'Malawi', 'Malaysia', 'Maldive', 'Mali', 'Marocco', 'Mauritania', 'Maurizio', 'Messico', 'Moldova', 'Mongolia', 'Montenegro', 'Mozambico', 'Myanmar/Birmania', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvegia', 'Nuova Zelanda', 'Oman', 'Pakistan', 'Palau', 'Palestina', 'Panama', 'Papua Nuova Guinea', 'Paraguay', 'Perù', 'Qatar', 'Regno Unito', 'Repubblica Centrafricana', 'Repubblica Democratica del Congo', 'Repubblica Dominicana', 'Ruanda', 'Saint Kitts e Nevis', 'Saint Vincent e Grenadine', 'Samoa', 'Santa Lucia', 'Sao Tomé e Principe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Siria', 'Somalia', 'Sri Lanka', 'Stati Federati di Micronesia', 'Stati Uniti d\'America', 'Sud Sudan', 'Sudafrica', 'Sudan', 'Suriname', 'Svizzera', 'Tagikistan', 'Taiwan', 'Tanzania', 'Thailandia', 'Timor Leste', 'Togo', 'Tonga', 'Trinidad e Tobago', 'Tunisia', 'Turchia', 'Turkmenistan', 'Tuvalu', 'Ucraina', 'Uganda', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

  const permessiSoggiorno = ['Affidamento', 'Asilo', 'Assistenza minore', 'Attesa occupazione', 'Casi speciali', 'Lavoro autonomo', 'Lavoro stagionale', 'Lavoro subordinato', 'Minore età', 'Motivi familiari', 'Motivi religiosi', 'Motivi umanitari', 'Permesso di soggiorno per titolari di Carta Blu UE', 'Permesso di soggiorno UE per soggiornanti di lungo periodo', 'Protezione sociale', 'Protezione sussidiaria', 'Residenza elettiva', 'Ricerca scientifica', 'Richiesta asilo', 'Studio/tirocinio/formazione', 'Altro permesso', 'Permesso in corso di rilascio', 'Non Applicabile (progetti nei paesi d\'origine)', 'Non Applicabile (bambini minori regolarmente soggiornanti)', 'Non Applicabile (rimpatrio forzato)'];

  const targetSpecifici = ['Minore', 'MSNA', 'Anziano (over 65)', 'Genitore single con figlio minorenne', 'Persone con vulnerabilità dati sensibili'];

  const titoliStudio = ['Nessuno', 'Istruzione primaria', 'Istruzione secondaria inferiore (primo stadio istruzione secondaria)', 'Istruzione secondaria superiore (ultimo stadio della istruzione superiore)', 'Istruzione post-secondaria non terziaria (percorsi di formazione tecnica superiore)', 'Istruzione terziaria di ciclo breve', 'Istruzione superiore: Bachelor o equivalenti (laurea triennale)', 'Istruzione superiore: Master o equivalenti (laurea magistrale)', 'Istruzione superiore: Dottorale o equivalenti (Dottorato)'];

  const lavoriOrigine = ['Operaio e lavoratore non specializzati', 'Operaio qualificato', 'Artigiano', 'Operatore di attività commerciali di servizio alle persone', 'Impiegato non tecnico', 'Tecnico, amministrativo, intellettuale a media qualificazione', 'Tecnico, amministrativo, intellettuale a elevata qualificazione', 'Imprenditore', 'Dirigente di strutture complesse'];

  const risultati = ['Risultato non ancora verificabile (supporto in corso) / Non applicabile', 'Risultato positivo', 'Risultato negativo'];

  return (
    <div className="app">
      <h1>Scheda Cittadini di Paesi Terzi</h1>
      <p><strong>{azione}</strong></p>
      <p><strong>{sottoazione}</strong></p>
      <p><strong>{opzione}</strong></p>
      {fondo && <p><strong>Fondo: {fondo}</strong></p>}

      <form onSubmit={handleSubmit} className="form-container">
        
        <div className="form-section">
          <h3 className="form-section-title">Anagrafica</h3>
          
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
                <input type="date" name="dataNascita" placeholder="Data di nascita" value={formData.dataNascita} onChange={handleChange} className="form-input" required />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <select name="nazionalita" value={formData.nazionalita} onChange={handleChange} className="form-select">
                  <option value="">Nazionalità</option>
                  {nazionalita.map((naz) => <option key={naz} value={naz}>{naz}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <select name="permessoSoggiorno" value={formData.permessoSoggiorno} onChange={handleChange} className="form-select">
                  <option value="">Tipologia permesso di soggiorno</option>
                  {permessiSoggiorno.map((perm) => <option key={perm} value={perm}>{perm}</option>)}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <textarea name="note" placeholder="Note (in caso di temporanea indisponibilità del permesso)" value={formData.note} onChange={handleChange} className="form-input" rows="1"></textarea>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <select name="targetSpecifico1" value={formData.targetSpecifico1} onChange={handleChange} className="form-select">
                  <option value="">Target specifico rilevato (1)</option>
                  {getTargetOptions('targetSpecifico1')}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <select name="targetSpecifico2" value={formData.targetSpecifico2} onChange={handleChange} className="form-select">
                  <option value="">Target specifico rilevato (2)</option>
                  {getTargetOptions('targetSpecifico2')}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <select name="targetSpecifico3" value={formData.targetSpecifico3} onChange={handleChange} className="form-select">
                  <option value="">Target specifico rilevato (3)</option>
                  {getTargetOptions('targetSpecifico3')}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <select name="titoloStudio" value={formData.titoloStudio} onChange={handleChange} className="form-select">
                  <option value="">Titolo di studio</option>
                  {titoliStudio.map((titolo) => <option key={titolo} value={titolo}>{titolo}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <select name="lavoroPaesOrigine" value={formData.lavoroPaesOrigine} onChange={handleChange} className="form-select">
                  <option value="">Eventuale lavoro svolto nel paese d'origine</option>
                  {lavoriOrigine.map((lavoro) => <option key={lavoro} value={lavoro}>{lavoro}</option>)}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <input type="tel" name="telefono" placeholder="Telefono (se disponibile)" value={formData.telefono} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <input type="email" name="email" placeholder="E-mail (se disponibile)" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Periodo Supporto Ricevuto</h3>

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
          <h3 className="form-section-title">OS2 - Migrazione legale e integrazione: Tipologia di Supporto Ricevuto</h3>
          
          <div className="form-table-group">
            <div className="form-table-row">
              <label className="form-label">Formazione linguistica (O.2.3; O.2.3.1; O.2.28.p):</label>
              <div className="form-radio-group">
                <label><input type="radio" name="formazioneLinquistica" value="si" checked={formData.formazioneLinquistica === 'si'} onChange={handleChange} />Si</label>
                <label><input type="radio" name="formazioneLinquistica" value="no" checked={formData.formazioneLinquistica === 'no'} onChange={handleChange} />No</label>
              </div>
            </div>

            <div className="form-table-row">
              <label className="form-label">Orientamento professionale personalizzato e sostegno all'occupabilità (O.2.3; O.2.3.3):</label>
              <div className="form-radio-group">
                <label><input type="radio" name="orientamentoProfessionale" value="si" checked={formData.orientamentoProfessionale === 'si'} onChange={handleChange} />Si</label>
                <label><input type="radio" name="orientamentoProfessionale" value="no" checked={formData.orientamentoProfessionale === 'no'} onChange={handleChange} />No</label>
              </div>
            </div>

            <div className="form-table-row">
              <label className="form-label">Educazione civica (O.2.3; O.2.3.2):</label>
              <div className="form-radio-group">
                <label><input type="radio" name="educazioneCivica" value="si" checked={formData.educazioneCivica === 'si'} onChange={handleChange} />Si</label>
                <label><input type="radio" name="educazioneCivica" value="no" checked={formData.educazioneCivica === 'no'} onChange={handleChange} />No</label>
              </div>
            </div>

            <div className="form-table-row">
              <label className="form-label">Supporto all'inserimento scolastico (O.2.3; O.2.3.1; O.2.3.2; O.2.29.p):</label>
              <div className="form-radio-group">
                <label><input type="radio" name="supportoInserimentoScolastico" value="si" checked={formData.supportoInserimentoScolastico === 'si'} onChange={handleChange} />Si</label>
                <label><input type="radio" name="supportoInserimentoScolastico" value="no" checked={formData.supportoInserimentoScolastico === 'no'} onChange={handleChange} />No</label>
              </div>
            </div>

            <div className="form-table-row">
              <label className="form-label">Supporto per l'accesso alla formazione universitaria e riconoscimento dei titoli (O.2.3):</label>
              <div className="form-radio-group">
                <label><input type="radio" name="supportoFormazioneUniversitaria" value="si" checked={formData.supportoFormazioneUniversitaria === 'si'} onChange={handleChange} />Si</label>
                <label><input type="radio" name="supportoFormazioneUniversitaria" value="no" checked={formData.supportoFormazioneUniversitaria === 'no'} onChange={handleChange} />No</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Risultati</h3>

          <div className="form-table-group">
            <div className="form-table-row">
              <label className="form-label">Miglioramento competenze linguistiche (R.2.8; R.2.10.p):</label>
              <select name="miglioramentoCompetenzeLinguistiche" value={formData.miglioramentoCompetenzeLinguistiche} onChange={handleChange} className="form-select" disabled={formData.formazioneLinquistica !== 'si' || !isProjectEnded} required={formData.formazioneLinquistica === 'si'} title="Compilabile solo se: Formazione linguistica = Si E Data fine supporto è nel passato">
                <option value="">-- Seleziona --</option>
                {risultati.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-table-row">
              <label className="form-label">Utilità supporto per integrazione (R.2.9):</label>
              <select name="utilitaFormazioneIntegrazione" value={formData.utilitaFormazioneIntegrazione} onChange={handleChange} className="form-select" disabled={!isProjectEnded} title="Compilabile solo se la Data fine supporto è nel passato">
                <option value="">-- Seleziona --</option>
                {risultati.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-table-row">
              <label className="form-label">Soddisfazione:</label>
              <select name="soddisfazione" value={formData.soddisfazione} onChange={handleChange} className="form-select" disabled={!isProjectEnded} title="Compilabile solo se la Data fine supporto è nel passato">
                <option value="">-- Seleziona --</option>
                {risultati.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
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
