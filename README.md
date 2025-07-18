# 🎾 Tennis Tournament Manager - Doppio Misto

Un'applicazione web moderna per gestire tornei di tennis doppio misto con un bellissimo tema giallo.

![Tennis Tournament Manager](https://img.shields.io/badge/Tennis-Tournament%20Manager-FFD700?style=for-the-badge&logo=tennis)

## ✨ Caratteristiche

- **Gestione Tornei**: Crea e gestisci più tornei simultaneamente
- **Squadre Doppio Misto**: Registra squadre composte da un giocatore maschile e una giocatrice femminile  
- **Tabellone Automatico**: Genera automaticamente i tabelloni eliminatori
- **Gestione Partite**: Inserisci risultati, orari e campi per ogni partita
- **Calendario**: Visualizza tutte le partite programmate
- **Design Responsivo**: Perfetto su desktop, tablet e mobile
- **Tema Giallo**: Design elegante con colori ispirati al tennis

## 🛠️ Tecnologie Utilizzate

### Backend
- **Node.js** + **Express.js**: Server REST API
- **UUID**: Generazione ID univoci
- **CORS**: Gestione richieste cross-origin

### Frontend  
- **React 18**: Interfaccia utente moderna
- **React Router**: Navigazione SPA
- **Axios**: Client HTTP
- **Lucide React**: Icone eleganti
- **CSS3**: Styling avanzato con tema giallo

## 🚀 Installazione

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione Rapida

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd tennis-tournament-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm run install-all
   ```

3. **Avvia l'applicazione**
   ```bash
   npm run dev
   ```

4. **Apri il browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Installazione Manuale

Se preferisci installare manualmente:

```bash
# Installa dipendenze server
npm install

# Installa dipendenze client
cd client
npm install
cd ..

# Avvia il server di sviluppo
npm run dev
```

## 📖 Guida d'Uso

### 1. Creare un Torneo

1. Vai alla sezione "Tornei" 
2. Clicca "Nuovo Torneo"
3. Inserisci:
   - Nome del torneo
   - Data
   - Località
   - Numero massimo di squadre (8, 16, 32, 64)

### 2. Aggiungere Squadre

1. Entra nel dettaglio del torneo
2. Vai alla scheda "Squadre"
3. Clicca "Aggiungi Squadra"
4. Inserisci:
   - Nome del giocatore maschile
   - Nome della giocatrice femminile
   - Ranking (opzionale)

### 3. Generare il Tabellone

1. Una volta aggiunte almeno 2 squadre
2. Clicca "Genera Tabellone"
3. Il sistema creerà automaticamente tutti gli accoppiamenti

### 4. Gestire le Partite

1. Vai alla scheda "Tabellone"
2. Clicca su "Modifica" per ogni partita
3. Inserisci:
   - Risultato (es. "6-4, 6-2")
   - Campo di gioco
   - Orario programmato
   - Stato della partita
   - Vincitore (se terminata)

### 5. Visualizzare il Calendario

- Sezione "Calendario": vedi tutte le partite di tutti i tornei
- Filtra per stato: programmate, in corso, terminate
- Ordine cronologico automatico

## 🎨 Interfaccia

### Tema Giallo Tennis
- **Colore Primario**: #FFD700 (Oro)
- **Colore Secondario**: #FFA500 (Arancione)
- **Sfondo**: Gradiente giallo chiaro
- **Accenti**: Dettagli in oro scuro (#DAA520)

### Layout Responsivo
- **Desktop**: Layout a griglia multi-colonna
- **Tablet**: Layout adattivo con 2 colonne
- **Mobile**: Layout singola colonna ottimizzato

## 🔧 Script NPM Disponibili

```bash
# Sviluppo - avvia client e server simultaneamente
npm run dev

# Solo server backend
npm run server

# Solo client frontend  
npm run client

# Build per produzione
npm run build

# Installa tutte le dipendenze
npm run install-all

# Avvio produzione
npm start
```

## 📁 Struttura del Progetto

```
tennis-tournament-app/
├── server/
│   └── index.js              # Server Express.js
├── client/
│   ├── public/
│   │   └── index.html         # Template HTML
│   └── src/
│       ├── components/        # Componenti React
│       │   ├── TournamentList.js
│       │   ├── TournamentDetail.js
│       │   ├── TournamentForm.js
│       │   ├── TeamForm.js
│       │   ├── TournamentBracket.js
│       │   ├── MatchForm.js
│       │   ├── TeamManagement.js
│       │   └── MatchSchedule.js
│       ├── App.js             # Componente principale
│       ├── index.js           # Entry point React
│       └── index.css          # Stili CSS
├── package.json               # Dipendenze e script
└── README.md                  # Questo file
```

## 🌟 Funzionalità Principali

### Gestione Tornei
- ✅ Creazione/modifica/eliminazione tornei
- ✅ Stati: Iscrizioni Aperte, In Corso, Completato
- ✅ Configurazione numero massimo squadre

### Gestione Squadre
- ✅ Squadre doppio misto (M/F)
- ✅ Sistema di ranking opzionale
- ✅ Vista globale di tutte le squadre

### Sistema Tabellone
- ✅ Generazione automatica bracket eliminatorio
- ✅ Accoppiamenti casuali
- ✅ Supporto per 8, 16, 32, 64 squadre
- ✅ Visualizzazione round (Primi turni, Quarti, Semi, Finale)

### Gestione Partite
- ✅ Inserimento risultati
- ✅ Assegnazione campi
- ✅ Programmazione orari
- ✅ Selezione vincitori
- ✅ Stati: Programmata, In Corso, Terminata

### Calendario e Scheduling
- ✅ Vista cronologica di tutte le partite
- ✅ Filtri per stato partita
- ✅ Informazioni complete per ogni match

## 🔮 Sviluppi Futuri

- [ ] Database persistente (MongoDB/PostgreSQL)
- [ ] Autenticazione utenti
- [ ] Notifiche email/SMS
- [ ] Statistiche avanzate
- [ ] Export PDF dei tabelloni
- [ ] Sistema di seeding intelligente
- [ ] Live scoring
- [ ] Integrazione con ranking ufficiali

## 🐛 Segnalazione Bug

Se trovi un bug o hai suggerimenti:

1. Controlla se il problema è già stato segnalato
2. Crea una nuova issue con:
   - Descrizione dettagliata
   - Passi per riprodurre il problema
   - Browser e sistema operativo
   - Screenshot se possibile

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Pusha il branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 👨‍💻 Autore

**Tennis Tournament Manager Team**

---

Fatto con ❤️ e ☕ per gli amanti del tennis! 🎾
