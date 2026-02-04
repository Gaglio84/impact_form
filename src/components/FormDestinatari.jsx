import React, { useState } from 'react';
import './Forms.css';

function Button({ children, onClick, style, variant = 'primary' }) {
  const baseClass = 'form-button';
  const variantClass = variant === 'primary' ? 'form-button-primary' : 'form-button-secondary';
  return <button onClick={onClick} className={`${baseClass} ${variantClass}`} style={style}>{children}</button>;
}

export default function FormDestinatari({ azione, sottoazione, opzione, onIndietro }) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datiCompleti = {
      azione: azione,
      sottoazione: sottoazione,
      opzione: opzione,
      ...formData
    };
    console.log('Dati inviati:', datiCompleti);
    alert('Form inviato con successo!');
  };

  return (
    <div className="app">
      <h1>Form Informazioni</h1>
      <p><strong>Azione:</strong> {azione}</p>
      <p><strong>Sottoazione:</strong> {sottoazione}</p>
      <p><strong>Opzione:</strong> {opzione}</p>

      <form onSubmit={handleSubmit} className="form-container-small">
        
        <div className="form-section">
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
        </div>

        <div className="form-button-group">
          <Button variant="primary">Invia</Button>
          <Button onClick={onIndietro} variant="secondary">Indietro</Button>
        </div>
      </form>
    </div>
  );
}
