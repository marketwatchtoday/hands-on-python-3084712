import React, { useState } from 'react';
import { Edit, Trophy, Clock } from 'lucide-react';
import axios from 'axios';
import MatchForm from './MatchForm';

const TournamentBracket = ({ matches, teams, onMatchUpdate }) => {
  const [editingMatch, setEditingMatch] = useState(null);
  const [showMatchForm, setShowMatchForm] = useState(false);

  const getTeamById = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  const getTeamDisplayName = (teamId) => {
    const team = getTeamById(teamId);
    if (!team) return 'TBD';
    return `${team.malePlayer} / ${team.femalePlayer}`;
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setShowMatchForm(true);
  };

  const handleMatchSubmit = async (matchData) => {
    try {
      await axios.put(`/api/matches/${editingMatch.id}`, matchData);
      setShowMatchForm(false);
      setEditingMatch(null);
      onMatchUpdate();
    } catch (error) {
      console.error('Errore nell\'aggiornamento della partita:', error);
      alert('Errore nell\'aggiornamento della partita');
    }
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

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});

  const rounds = Object.keys(matchesByRound).sort((a, b) => parseInt(a) - parseInt(b));

  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <Trophy size={64} color="#DAA520" />
        <h3>Nessuna partita nel tabellone</h3>
        <p>Genera il tabellone per vedere le partite!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bracket">
        {rounds.map(round => (
          <div key={round} className="bracket-round">
            <h4 className="text-center mb-2">
              {round === '1' ? 'Primo Turno' : 
               round === '2' ? 'Secondo Turno' :
               round === '3' ? 'Quarti di Finale' :
               round === '4' ? 'Semifinale' :
               round === '5' ? 'Finale' : `Turno ${round}`}
            </h4>
            
            {matchesByRound[round].map(match => (
              <div key={match.id} className="bracket-match">
                <div className="flex-between mb-2">
                  {getStatusBadge(match.status)}
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleEditMatch(match)}
                  >
                    <Edit size={14} />
                  </button>
                </div>

                <div className="bracket-team">
                  <span className="team-name">
                    {getTeamDisplayName(match.team1Id)}
                  </span>
                  <span className="team-score">
                    {match.score ? match.score.split('-')[0] || '-' : '-'}
                  </span>
                </div>

                <div className="bracket-team">
                  <span className="team-name">
                    {getTeamDisplayName(match.team2Id)}
                  </span>
                  <span className="team-score">
                    {match.score ? match.score.split('-')[1] || '-' : '-'}
                  </span>
                </div>

                {match.court && (
                  <div className="mt-2 text-center">
                    <small style={{ color: '#666' }}>Campo: {match.court}</small>
                  </div>
                )}

                {match.scheduledTime && (
                  <div className="flex-center gap-1 mt-1">
                    <Clock size={14} />
                    <small style={{ color: '#666' }}>
                      {new Date(match.scheduledTime).toLocaleString('it-IT')}
                    </small>
                  </div>
                )}

                {match.winnerId && (
                  <div className="text-center mt-2">
                    <span className="status-badge status-finished">
                      🏆 Vincitore: {getTeamDisplayName(match.winnerId)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showMatchForm && (
        <MatchForm
          match={editingMatch}
          teams={teams}
          onSubmit={handleMatchSubmit}
          onCancel={() => {
            setShowMatchForm(false);
            setEditingMatch(null);
          }}
        />
      )}
    </div>
  );
};

export default TournamentBracket;