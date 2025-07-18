import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Play, Plus, Settings } from 'lucide-react';
import axios from 'axios';
import TeamForm from './TeamForm';
import TournamentBracket from './TournamentBracket';

const TournamentDetail = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');

  useEffect(() => {
    fetchTournamentData();
  }, [id]);

  const fetchTournamentData = async () => {
    try {
      const [tournamentRes, teamsRes, matchesRes] = await Promise.all([
        axios.get(`/api/tournaments`),
        axios.get(`/api/tournaments/${id}/teams`),
        axios.get(`/api/tournaments/${id}/matches`)
      ]);
      
      const tournamentData = tournamentRes.data.find(t => t.id === id);
      setTournament(tournamentData);
      setTeams(teamsRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Errore nel caricamento dei dati del torneo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setShowTeamForm(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowTeamForm(true);
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa squadra?')) {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        fetchTournamentData();
      } catch (error) {
        console.error('Errore nell\'eliminazione della squadra:', error);
        alert('Errore nell\'eliminazione della squadra');
      }
    }
  };

  const handleTeamSubmit = async (teamData) => {
    try {
      if (editingTeam) {
        await axios.put(`/api/teams/${editingTeam.id}`, teamData);
      } else {
        await axios.post(`/api/tournaments/${id}/teams`, teamData);
      }
      setShowTeamForm(false);
      setEditingTeam(null);
      fetchTournamentData();
    } catch (error) {
      console.error('Errore nel salvataggio della squadra:', error);
      alert('Errore nel salvataggio della squadra');
    }
  };

  const handleGenerateBracket = async () => {
    if (teams.length < 2) {
      alert('Servono almeno 2 squadre per generare il tabellone');
      return;
    }

    if (window.confirm('Generare il tabellone del torneo? Questo cancellerà eventuali partite esistenti.')) {
      try {
        await axios.post(`/api/tournaments/${id}/generate-bracket`);
        fetchTournamentData();
        setActiveTab('bracket');
      } catch (error) {
        console.error('Errore nella generazione del tabellone:', error);
        alert('Errore nella generazione del tabellone');
      }
    }
  };

  if (loading) {
    return <div className="loading">Caricamento torneo...</div>;
  }

  if (!tournament) {
    return <div className="empty-state">Torneo non trovato</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <div className="flex gap-2">
          <Link to="/" className="btn btn-secondary btn-small">
            <ArrowLeft size={16} />
            Torna ai Tornei
          </Link>
          <h2>{tournament.name}</h2>
        </div>
        <div className="flex gap-2">
          <span className={`status-badge status-${tournament.status}`}>
            {tournament.status === 'registration' ? 'Iscrizioni Aperte' :
             tournament.status === 'active' ? 'In Corso' : 'Completato'}
          </span>
        </div>
      </div>

      <div className="card mb-3">
        <div className="grid grid-3">
          <div className="info-item">
            <div className="info-label">Data</div>
            <div className="info-value">{new Date(tournament.date).toLocaleDateString('it-IT')}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Località</div>
            <div className="info-value">{tournament.location}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Squadre Iscritte</div>
            <div className="info-value">{teams.length} / {tournament.maxTeams}</div>
          </div>
        </div>
      </div>

      <nav className="nav mb-3">
        <div className="nav-list">
          <button 
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            <Users size={20} />
            Squadre ({teams.length})
          </button>
          <button 
            className={`nav-link ${activeTab === 'bracket' ? 'active' : ''}`}
            onClick={() => setActiveTab('bracket')}
          >
            <Trophy size={20} />
            Tabellone ({matches.length} partite)
          </button>
        </div>
      </nav>

      {activeTab === 'teams' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={24} />
              Squadre Iscritte
            </h3>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={handleAddTeam}>
                <Plus size={20} />
                Aggiungi Squadra
              </button>
              {teams.length >= 2 && (
                <button className="btn btn-warning" onClick={handleGenerateBracket}>
                  <Settings size={20} />
                  Genera Tabellone
                </button>
              )}
            </div>
          </div>

          {teams.length === 0 ? (
            <div className="empty-state">
              <Users size={64} color="#DAA520" />
              <h3>Nessuna squadra iscritta</h3>
              <p>Aggiungi le prime squadre al torneo!</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Giocatore Maschile</th>
                    <th>Giocatrice Femminile</th>
                    <th>Ranking</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => (
                    <tr key={team.id}>
                      <td>{team.malePlayer}</td>
                      <td>{team.femalePlayer}</td>
                      <td>{team.ranking || 'N/A'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-secondary btn-small"
                            onClick={() => handleEditTeam(team)}
                          >
                            Modifica
                          </button>
                          <button 
                            className="btn btn-danger btn-small"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bracket' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={24} />
              Tabellone Torneo
            </h3>
            {matches.length > 0 && (
              <button className="btn btn-warning" onClick={handleGenerateBracket}>
                <Settings size={20} />
                Rigenera Tabellone
              </button>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="empty-state">
              <Trophy size={64} color="#DAA520" />
              <h3>Tabellone non generato</h3>
              <p>Genera il tabellone per iniziare il torneo!</p>
              {teams.length >= 2 && (
                <button className="btn btn-primary mt-2" onClick={handleGenerateBracket}>
                  <Play size={20} />
                  Genera Tabellone
                </button>
              )}
            </div>
          ) : (
            <TournamentBracket
              matches={matches}
              teams={teams}
              onMatchUpdate={fetchTournamentData}
            />
          )}
        </div>
      )}

      {showTeamForm && (
        <TeamForm
          team={editingTeam}
          onSubmit={handleTeamSubmit}
          onCancel={() => {
            setShowTeamForm(false);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default TournamentDetail;