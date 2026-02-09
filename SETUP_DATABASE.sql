-- TABELLA UTENTI DATA ENTRY
CREATE TABLE data_entry_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nome_organizzazione TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELLA ATTIVITÀ FORMATIVE
CREATE TABLE attività_formative (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome TEXT NOT NULL,
  descrizione TEXT,
  data_inizio DATE,
  data_fine DATE,
  user_id BIGINT REFERENCES data_entry_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELLA ASSOCIAZIONE DESTINATARI ↔ ATTIVITÀ
CREATE TABLE destinatari_attività (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  attività_id BIGINT REFERENCES attività_formative(id) ON DELETE CASCADE,
  destinatario_id BIGINT REFERENCES azioni23(id) ON DELETE CASCADE,
  data_associazione TIMESTAMP DEFAULT NOW(),
  UNIQUE(attività_id, destinatario_id)
);

-- INSERT 15 DATA ENTRY USERS
INSERT INTO data_entry_users (username, password, nome_organizzazione) VALUES
('gera_adda', 'gera2024', 'Azienda speciale Consortile Risorsa Sociale Gera d''Adda'),
('ghedi', 'ghedi2024', 'Azienda Territoriale per i Servizi alla Persona GHEDI'),
('vallecamonica', 'valle2024', 'AZIENDA TERRITORIALE PER I SERVIZI ALLA PERSONA DI VALLECAMONICA - BRENO'),
('comasca', 'comas2024', 'Azienda Sociale Comasca e Lariana'),
('cremasca', 'crema2024', 'Azienda speciale Consortile Comunità Sociale Cremasca a.s.c.'),
('retesalute', 'rete2024', 'Azienda Speciale Retesalute - MERATE'),
('lodigiano', 'lodi2024', 'AZIENDA SPECIALE CONSORTILE DEL LODIGIANO PER I SERVIZI ALLA PERSONA'),
('carate', 'carate2024', 'Ufficio di Piano di Carate Brianza'),
('comuni_insieme', 'comuni2024', 'A.S.C. Comuni insieme per lo Sviluppo Sociale'),
('milano', 'milano2024', 'Comune di Milano'),
('assemi', 'assemi2024', 'A.S.S.E.MI. (Azienda Sociale Sud Est Milano), capofila del Distretto Sociale Sud Est Milano'),
('siziano', 'sizi2024', 'COMUNE DI SIZIANO'),
('verbano', 'verba2024', 'Comunità Montana Valli del Verbano- Area Sociale Ambito Distrettuale di Cittiglio'),
('anci', 'anci2024', 'ANCI'),
('ismu', 'ismu2024', 'ISMU');
