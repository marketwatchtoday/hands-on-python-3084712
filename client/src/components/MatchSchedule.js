import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';
import axios from 'axios';

const MatchSchedule = () => {
  const [tournaments, setTournaments] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tournamentsRes = await axios.get('/api/tournaments');
      const allMatchesData = [];
      const allTeamsData = [];
      
      for (const tournament of tournamentsRes.data) {
        try {
          const [matchesRes, teamsRes] = await Promise.all([
            axios.get(`/api/tournaments/${tournament.id}/matches`),
            axios.get(`/api/tournaments/${tournament.id}/teams`)
          ]);
          
          const matchesWithTournament = matchesRes.data.map(match => ({
            ...match,
            tournamentName: tournament.name,
            tournamentLocation: tournament.location
          }));
          
          const teamsWithTournament = teamsRes.data.map(team => ({
            ...team,
            tournamentId: tournament.id
          }));
          
          allMatchesData.push(...matchesWithTournament);
          allTeamsData.push(...teamsWithTournament);
        } catch (error) {
          console.error(`Errore nel caricamento dei dati per il torneo ${tournament.id}:`, error);
        }
      }

      setTournaments(tournamentsRes.data);
      setAllMatches(allMatchesData);
      setTeams(allTeamsData);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamById = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  const getTeamDisplayName = (teamId) => {
    const team = getTeamById(teamId);
    if (!team) return 'TBD';
    return `${team.malePlayer} / ${team.femalePlayer}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { text: 'Programmata', class: 'status-scheduled' },
      'in-progress': { text: 'In Corso', class: 'status-in-progress' },
      finished: { text: 'Terminata', class: 'status-finished' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-scheduled' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const filteredMatches = allMatches.filter(match => {
    if (filterStatus === 'all') return true;
    return match.status === filterStatus;
  });

  // Sort matches by scheduled time, then by tournament name
  const sortedMatches = filteredMatches.sort((a, b) => {
    if (a.scheduledTime && b.scheduledTime) {
      return new Date(a.scheduledTime) - new Date(b.scheduledTime);
    }
    if (a.scheduledTime && !b.scheduledTime) return -1;
    if (!a.scheduledTime && b.scheduledTime) return 1;
    return a.tournamentName.localeCompare(b.tournamentName);
  });

  if (loading) {
    return <div className="loading">Caricamento calendario...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2>Calendario Partite</h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">Tutte le partite</option>
            <option value="scheduled">Programmate</option>
            <option value="in-progress">In corso</option>
            <option value="finished">Terminate</option>
          </select>
          <span className="status-badge status-registration">
            {filteredMatches.length} partite
          </span>
        </div>
      </div>

      {sortedMatches.length === 0 ? (
        <div className="empty-state">
          <Calendar size={64} color="#DAA520" />
          <h3>Nessuna partita trovata</h3>
          <p>
            {filterStatus === 'all' 
              ? 'Crea dei tornei e genera i tabelloni per vedere le partite!'
              : `Nessuna partita con stato "${filterStatus}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {sortedMatches.map(match => (
            <div key={`${match.tournamentId}-${match.id}`} className="card">
              <div className="card-header">
                <div className="flex-between">
                  <div className="flex gap-2">
                    <Trophy size={20} />
                    <span>{match.tournamentName}</span>
                  </div>
                  {getStatusBadge(match.status)}
                </div>
              </div>

              <div className="match-details">
                <h4 className="mb-2">
                  {getTeamDisplayName(match.team1Id)} 
                  <span style={{ margin: '0 1rem', color: '#DAA520' }}>VS</span>
                  {getTeamDisplayName(match.team2Id)}
                </h4>

                {match.score && (
                  <div className="mb-2">
                    <strong>Risultato: </strong>
                    <span style={{ color: '#DAA520', fontWeight: 'bold' }}>
                      {match.score}
                    </span>
                  </div>
                )}

                {match.winnerId && (
                  <div className="mb-2">
                    <strong>Vincitore: </strong>
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      🏆 {getTeamDisplayName(match.winnerId)}
                    </span>
                  </div>
                )}

                <div className="match-info">
                  {match.scheduledTime && (
                    <div className="info-item">
                      <div className="info-label">
                        <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Orario
                      </div>
                      <div className="info-value">
                        {new Date(match.scheduledTime).toLocaleString('it-IT')}
                      </div>
                    </div>
                  )}

                  {match.court && (
                    <div className="info-item">
                      <div className="info-label">
                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Campo
                      </div>
                      <div className="info-value">{match.court}</div>
                    </div>
                  )}

                  <div className="info-item">
                    <div className="info-label">Turno</div>
                    <div className="info-value">
                      {match.round === 1 ? 'Primo Turno' : 
                       match.round === 2 ? 'Secondo Turno' :
                       match.round === 3 ? 'Quarti' :
                       match.round === 4 ? 'Semifinale' :
                       match.round === 5 ? 'Finale' : `Turno ${match.round}`}
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Località Torneo</div>
                    <div className="info-value">{match.tournamentLocation}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tournaments.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={24} />
              Statistiche Partite per Torneo
            </h3>
          </div>

          <div className="grid grid-3">
            {tournaments.map(tournament => {
              const tournamentMatches = allMatches.filter(match => match.tournamentId === tournament.id);
              const scheduledMatches = tournamentMatches.filter(m => m.status === 'scheduled').length;
              const inProgressMatches = tournamentMatches.filter(m => m.status === 'in-progress').length;
              const finishedMatches = tournamentMatches.filter(m => m.status === 'finished').length;

              return (
                <div key={tournament.id} className="card" style={{ margin: '0.5rem 0' }}>
                  <h4>{tournament.name}</h4>
                  <div className="mt-2">
                    <div className="flex gap-2 mb-1">
                      <Users size={16} />
                      <span>{tournamentMatches.length} partite totali</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {scheduledMatches > 0 && (
                        <span className="status-badge status-scheduled">
                          {scheduledMatches} programmate
                        </span>
                      )}
                      {inProgressMatches > 0 && (
                        <span className="status-badge status-in-progress">
                          {inProgressMatches} in corso
                        </span>
                      )}
                      {finishedMatches > 0 && (
                        <span className="status-badge status-finished">
                          {finishedMatches} terminate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;