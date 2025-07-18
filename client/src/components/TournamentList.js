import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Trophy, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import TournamentForm from './TournamentForm';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get('/api/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error('Errore nel caricamento dei tornei:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = () => {
    setEditingTournament(null);
    setShowForm(true);
  };

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo torneo?')) {
      try {
        await axios.delete(`/api/tournaments/${tournamentId}`);
        fetchTournaments();
      } catch (error) {
        console.error('Errore nell\'eliminazione del torneo:', error);
        alert('Errore nell\'eliminazione del torneo');
      }
    }
  };

  const handleFormSubmit = async (tournamentData) => {
    try {
      if (editingTournament) {
        await axios.put(`/api/tournaments/${editingTournament.id}`, tournamentData);
      } else {
        await axios.post('/api/tournaments', tournamentData);
      }
      setShowForm(false);
      setEditingTournament(null);
      fetchTournaments();
    } catch (error) {
      console.error('Errore nel salvataggio del torneo:', error);
      alert('Errore nel salvataggio del torneo');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      registration: { text: 'Iscrizioni Aperte', class: 'status-registration' },
      active: { text: 'In Corso', class: 'status-active' },
      completed: { text: 'Completato', class: 'status-completed' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'status-registration' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div className="loading">Caricamento tornei...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h2>Gestione Tornei</h2>
        <button className="btn btn-primary" onClick={handleCreateTournament}>
          <Plus size={20} />
          Nuovo Torneo
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <Trophy size={64} color="#DAA520" />
          <h3>Nessun torneo creato</h3>
          <p>Inizia creando il tuo primo torneo di doppio misto!</p>
          <button className="btn btn-primary mt-2" onClick={handleCreateTournament}>
            <Plus size={20} />
            Crea Primo Torneo
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Trophy size={24} />
                  {tournament.name}
                </h3>
                {getStatusBadge(tournament.status)}
              </div>
              
              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <Calendar size={16} />
                  <span>{new Date(tournament.date).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <MapPin size={16} />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex gap-2">
                  <Users size={16} />
                  <span>Max {tournament.maxTeams} squadre</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/tournament/${tournament.id}`} 
                  className="btn btn-primary flex-1"
                >
                  Gestisci
                </Link>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => handleEditTournament(tournament)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => handleDeleteTournament(tournament.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTournament(null);
          }}
        />
      )}
    </div>
  );
};

export default TournamentList;