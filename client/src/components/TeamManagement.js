import React, { useState, useEffect } from 'react';
import { Users, Trophy, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const TeamManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tournamentsRes = await axios.get('/api/tournaments');
      const allTeams = [];
      
      for (const tournament of tournamentsRes.data) {
        try {
          const teamsRes = await axios.get(`/api/tournaments/${tournament.id}/teams`);
          const teamsWithTournament = teamsRes.data.map(team => ({
            ...team,
            tournamentName: tournament.name,
            tournamentDate: tournament.date
          }));
          allTeams.push(...teamsWithTournament);
        } catch (error) {
          console.error(`Errore nel caricamento delle squadre per il torneo ${tournament.id}:`, error);
        }
      }

      setTournaments(tournamentsRes.data);
      setTeams(allTeams);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa squadra?')) {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        fetchData();
      } catch (error) {
        console.error('Errore nell\'eliminazione della squadra:', error);
        alert('Errore nell\'eliminazione della squadra');
      }
    }
  };

  if (loading) {
    return <div className="loading">Caricamento squadre...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2>Gestione Squadre</h2>
        <div className="flex gap-2">
          <span className="status-badge status-registration">
            {teams.length} squadre totali
          </span>
          <span className="status-badge status-active">
            {tournaments.length} tornei attivi
          </span>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <Users size={64} color="#DAA520" />
          <h3>Nessuna squadra trovata</h3>
          <p>Crea un torneo e aggiungi delle squadre per iniziare!</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={24} />
              Tutte le Squadre
            </h3>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Torneo</th>
                  <th>Giocatore Maschile</th>
                  <th>Giocatrice Femminile</th>
                  <th>Ranking</th>
                  <th>Data Torneo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={`${team.tournamentId}-${team.id}`}>
                    <td>
                      <div className="flex gap-1">
                        <Trophy size={16} />
                        {team.tournamentName}
                      </div>
                    </td>
                    <td>{team.malePlayer}</td>
                    <td>{team.femalePlayer}</td>
                    <td>{team.ranking || 'N/A'}</td>
                    <td>{new Date(team.tournamentDate).toLocaleDateString('it-IT')}</td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 size={14} />
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tournaments.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={24} />
              Statistiche per Torneo
            </h3>
          </div>

          <div className="grid grid-3">
            {tournaments.map(tournament => {
              const tournamentTeams = teams.filter(team => team.tournamentId === tournament.id);
              return (
                <div key={tournament.id} className="card" style={{ margin: '0.5rem 0' }}>
                  <h4>{tournament.name}</h4>
                  <div className="mt-2">
                    <div className="flex gap-2 mb-1">
                      <Users size={16} />
                      <span>{tournamentTeams.length} squadre</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`status-badge status-${tournament.status}`}>
                        {tournament.status === 'registration' ? 'Iscrizioni Aperte' :
                         tournament.status === 'active' ? 'In Corso' : 'Completato'}
                      </span>
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

export default TeamManagement;