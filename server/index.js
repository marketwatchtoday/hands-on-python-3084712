const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// In-memory storage (in production, use a database)
let tournaments = [];
let teams = [];
let matches = [];

// Tournament Routes
app.get('/api/tournaments', (req, res) => {
  res.json(tournaments);
});

app.post('/api/tournaments', (req, res) => {
  const tournament = {
    id: uuidv4(),
    name: req.body.name,
    date: req.body.date,
    location: req.body.location,
    maxTeams: req.body.maxTeams || 16,
    status: 'registration',
    createdAt: new Date()
  };
  tournaments.push(tournament);
  res.status(201).json(tournament);
});

app.put('/api/tournaments/:id', (req, res) => {
  const index = tournaments.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Torneo non trovato' });
  }
  tournaments[index] = { ...tournaments[index], ...req.body };
  res.json(tournaments[index]);
});

app.delete('/api/tournaments/:id', (req, res) => {
  const index = tournaments.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Torneo non trovato' });
  }
  tournaments.splice(index, 1);
  res.status(204).send();
});

// Team Routes
app.get('/api/tournaments/:tournamentId/teams', (req, res) => {
  const tournamentTeams = teams.filter(t => t.tournamentId === req.params.tournamentId);
  res.json(tournamentTeams);
});

app.post('/api/tournaments/:tournamentId/teams', (req, res) => {
  const team = {
    id: uuidv4(),
    tournamentId: req.params.tournamentId,
    malePlayer: req.body.malePlayer,
    femalePlayer: req.body.femalePlayer,
    ranking: req.body.ranking || 0,
    createdAt: new Date()
  };
  teams.push(team);
  res.status(201).json(team);
});

app.put('/api/teams/:id', (req, res) => {
  const index = teams.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Squadra non trovata' });
  }
  teams[index] = { ...teams[index], ...req.body };
  res.json(teams[index]);
});

app.delete('/api/teams/:id', (req, res) => {
  const index = teams.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Squadra non trovata' });
  }
  teams.splice(index, 1);
  res.status(204).send();
});

// Match Routes
app.get('/api/tournaments/:tournamentId/matches', (req, res) => {
  const tournamentMatches = matches.filter(m => m.tournamentId === req.params.tournamentId);
  res.json(tournamentMatches);
});

app.post('/api/tournaments/:tournamentId/matches', (req, res) => {
  const match = {
    id: uuidv4(),
    tournamentId: req.params.tournamentId,
    team1Id: req.body.team1Id,
    team2Id: req.body.team2Id,
    round: req.body.round,
    score: req.body.score || '',
    winnerId: req.body.winnerId || null,
    status: req.body.status || 'scheduled',
    court: req.body.court || '',
    scheduledTime: req.body.scheduledTime || null,
    createdAt: new Date()
  };
  matches.push(match);
  res.status(201).json(match);
});

app.put('/api/matches/:id', (req, res) => {
  const index = matches.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Partita non trovata' });
  }
  matches[index] = { ...matches[index], ...req.body };
  res.json(matches[index]);
});

// Generate tournament bracket
app.post('/api/tournaments/:tournamentId/generate-bracket', (req, res) => {
  const tournamentId = req.params.tournamentId;
  const tournamentTeams = teams.filter(t => t.tournamentId === tournamentId);
  
  if (tournamentTeams.length < 2) {
    return res.status(400).json({ message: 'Servono almeno 2 squadre per generare il tabellone' });
  }

  // Clear existing matches for this tournament
  matches = matches.filter(m => m.tournamentId !== tournamentId);

  // Shuffle teams for random bracket
  const shuffledTeams = [...tournamentTeams].sort(() => Math.random() - 0.5);
  
  // Generate first round matches
  const firstRoundMatches = [];
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    if (i + 1 < shuffledTeams.length) {
      const match = {
        id: uuidv4(),
        tournamentId: tournamentId,
        team1Id: shuffledTeams[i].id,
        team2Id: shuffledTeams[i + 1].id,
        round: 1,
        score: '',
        winnerId: null,
        status: 'scheduled',
        court: '',
        scheduledTime: null,
        createdAt: new Date()
      };
      firstRoundMatches.push(match);
      matches.push(match);
    }
  }

  res.json(firstRoundMatches);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});