# Impact - Piattaforma Data Entry

Applicazione web per la gestione del data entry relativo al progetto Lab Impact, con supporto per tre azioni (Azione 1, 2, 3) e gestione di destinatari, operatori e mediatori.

## Struttura del Progetto

```
src/
├── components/              # Componenti React
│   ├── AttivitaFormativeManager.jsx    # Dashboard principale - Crea e gestisci attività formative
│   ├── DataEntryLogin.jsx              # Form di login per data entry
│   ├── DataEntryMenu.jsx               # Menu principale post-login
│   ├── DestinatariManager.jsx          # Gestione flusso selezione destinatari
│   ├── FormOperatori.jsx               # Form per Azione 1 - Operatori
│   ├── FormMediatoriAzione1.jsx        # Form per Azione 1 - Mediatori
│   ├── FormCittadinidiPaesiTerziAzione2.jsx  # Form per Azione 2 - Cittadini paesi terzi
│   ├── FormMediatoriAzione2.jsx        # Form per Azione 2 - Mediatori
│   ├── FormCittadinidiPaesiTerziAzione3.jsx  # Form per Azione 3 - Cittadini paesi terzi
│   ├── FormMediatoriAzione3.jsx        # Form per Azione 3 - Mediatori
│   ├── PublicHomepage.jsx              # Homepage pubblica
│   ├── Forms.css                       # Stili riutilizzabili per i form
│   └── DataEntryLogin.jsx
├── styles/
│   └── global.css                      # Stili globali e dashboard
├── App.jsx                             # Router principale
├── App.css                             # Stili App
├── main.jsx                            # Entry point
├── index.css                           # Stili base
└── supabaseClient.js                   # Configurazione Supabase
```

## Guide di Navigazione per le Modifiche

### 1. Aggiungere Stili Globali
- **File**: `src/styles/global.css`
- **Utilizzo**: Stili per dashboard, modali, bottoni, form groups
- **Classi utili**:
  - `.dashboard-container` - Layout principale
  - `.modal-overlay` / `.modal-content` - Stili modale
  - `.btn-primary` / `.btn-secondary` / `.btn-danger` - Bottoni
  - `.form-group-small` - Gruppi form compatti
  - `.attività-item` - Item lista attività
  - `.destinatari-list` / `.destinatario-checkbox` - Lista destinatari

### 2. Aggiungere Stili per i Form
- **File**: `src/components/Forms.css`
- **Utilizzo**: Stili per form standard, sezioni, input
- **Classi utili**:
  - `.form-container` / `.form-container-small` - Container form
  - `.form-section` - Sezione form
  - `.form-row` / `.form-col` - Layout grid
  - `.form-group` - Gruppi input
  - `.form-button` / `.form-button-group` - Bottoni

### 3. Modificare la Dashboard (AttivitaFormativeManager.jsx)
- **Location**: `src/components/AttivitaFormativeManager.jsx`
- **Componenti principali**:
  - **Panel sinistro**: Lista attività con search e paginazione
    - Classe: `.attività-list`
    - Input search: `.search-input`
    - Item: `.attività-item` con bottoni `.btn-action`
  - **Panel destro (Destinatari)**: Modalità "destinatari"
    - Classe: `.attività-details`
    - Lista: `.destinatari-list`
  - **Modale Modifica**: Modalità "modifica"
    - Classe: `.modal-overlay` / `.modal-content`
    - Header: `.modal-header`
    - Body: `.modal-body`
    - Footer: `.modal-footer`

### 4. Modificare i Form dei Destinatari
- **Location**: `src/components/FormMediatori*.jsx` e `FormCittadini*.jsx`
- **File CSS**: `src/components/Forms.css`
- **Esempio di modifica**:
  1. Apri il file del form desiderato
  2. Modifica i campi nel JSX
  3. Se necessari nuovi stili, aggiungili a `Forms.css` con nome classe logico
  4. Applica la classe al JSX

### 5. Aggiungere Stili Inline (DA EVITARE)
- **Attenzione**: Tutti gli stili sono centralizzati nei CSS
- Se noti uno stile inline nel JSX:
  1. Crea una classe in `global.css` o `Forms.css`
  2. Sostituisci lo stile inline con className
  3. Mantieni il codice pulito e riutilizzabile

## Classi CSS Principali

### Dashboard
- `.dashboard-container` - Root container
- `.dashboard-header` - Header con info utente e bottoni
- `.dashboard-tabs` - Tabs per navigazione
- `.dashboard-content` - Area contenuto principale
- `.attività-list` - Panel sinistro con lista attività
- `.attività-details` - Panel destro con dettagli

### Bottoni Azioni
- `.btn-action` - Base per bottoni azioni
- `.btn-action-associate` - Verde (#28a745)
- `.btn-action-edit` - Blu (#5a8fa5)
- `.btn-action-delete` - Rosso (#dc3545)
- `.btn-primary` - Verde salva (#28a745)
- `.btn-secondary` - Grigio (#6c757d)
- `.btn-danger` - Rosso (#dc3545)
- `.btn-info` - Blu (#007bff)

### Form Input
- `.search-input` - Campo ricerca
- `.form-group-small` - Gruppo form compatto
- `.form-group-row` - Riga con più gruppi affiancati
- `.form-group-small input` - Stili input
- `.form-group-small select` - Stili select

### Modale
- `.modal-overlay` - Background blur
- `.modal-content` - Container modale
- `.modal-header` - Header modale con titolo e chiudi
- `.modal-body` - Corpo modale scrollabile
- `.modal-footer` - Footer con bottoni

### Destinatari
- `.destinatari-list` - Container lista destinatari
- `.destinatario-checkbox` - Checkbox destinatario
- `.destinatario-checkbox input` - Checkbox style
- `.destinatario-checkbox span` - Testo nome

### Paginazione
- `.pagination-controls` - Container paginazione
- `.pagination-btn` - Bottone pagina
- `.pagination-info` - Testo info pagina

## Flusso di Navigazione

1. **Homepage Pubblica** → PublicHomepage.jsx
2. **Login** → DataEntryLogin.jsx
3. **Menu Principale** → DataEntryMenu.jsx
4. **2 Percorsi**:
   - **Attività Formative** → AttivitaFormativeManager.jsx (crea e gestisci attività)
   - **Gestione Destinatari** → DestinatariManager.jsx → FormMediatori*/FormCittadini*.jsx (compila dati destinatari)

## Configurazione Supabase

- File: `src/supabaseClient.js`
- Contiene connessione al database Supabase
- Tabelle principali:
  - `attività_formative` - Attività formative create
  - `azioni1` - Destinatari Azione 1
  - `azioni23` - Destinatari Azioni 2 e 3
  - `destinatari_attività_azione1` - Associazioni attività-destinatari Azione 1
  - `destinatari_attività_azione23` - Associazioni attività-destinatari Azioni 2-3

## Note di Sviluppo

- **Tutti gli stili inline sono stati consolidati** in `global.css` e `Forms.css`
- **Classi CSS strutturate logicamente** per facile manutenzione
- **Separazione responsabilità**: Componenti per logica, CSS per stile
- **Responsive design** supportato via media queries in CSS
- **Colori** definiti in variabili CSS (`:root`)

## Come Muoversi nel Codice

### Per modificare uno stile visivo:
1. Apri DevTools (F12) → Elementi
2. Individua la classe CSS applicata
3. Vai al file CSS (`global.css` o `Forms.css`)
4. Modifica la classe trovata

### Per aggiungere un nuovo elemento:
1. Aggiungi il JSX nel componente
2. Crea la classe CSS corrispondente (logicamente nominata)
3. Applica className al JSX
4. Utilizza le variabili CSS per colori consistenti

### Per navigare tra componenti:
1. Apri `src/App.jsx` per le rotte
2. Segui il percorso della rotta interessata
3. Ogni componente importa i CSS specifici
4. Stili globali automaticamente applicati
