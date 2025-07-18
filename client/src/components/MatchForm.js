import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const MatchForm = ({ match, teams, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    score: match?.score || '',
    status: match?.status || 'scheduled',
    court: match?.court || '',
    scheduledTime: match?.scheduledTime ? new Date(match.scheduledTime).toISOString().slice(0, 16) : '',
    winnerId: match?.winnerId || ''
  });

  const getTeamById = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  const getTeamDisplayName = (teamId) => {
    const team = getTeamById(teamId);
    if (!team) return 'TBD';
    return `${team.malePlayer} / ${team.femalePlayer}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : null
    };
    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Modifica Partita</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="match-details mb-3">
          <h4>
            {getTeamDisplayName(match.team1Id)} vs {getTeamDisplayName(match.team2Id)}
          </h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Stato Partita</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="scheduled">Programmata</option>
              <option value="in-progress">In Corso</option>
              <option value="finished">Terminata</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Risultato</label>
              <input
                type="text"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="form-input"
                placeholder="es. 6-4, 6-2"
              />
              <small style={{ color: '#666', fontSize: '0.9rem' }}>
                Formato: set1-set1, set2-set2 (es. 6-4, 6-2)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Campo</label>
              <input
                type="text"
                name="court"
                value={formData.court}
                onChange={handleChange}
                className="form-input"
                placeholder="es. Campo 1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Orario Programmato</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {formData.status === 'finished' && (
            <div className="form-group">
              <label className="form-label">Squadra Vincitrice</label>
              <select
                name="winnerId"
                value={formData.winnerId}
                onChange={handleChange}
                className="form-select"
                required={formData.status === 'finished'}
              >
                <option value="">Seleziona vincitore</option>
                <option value={match.team1Id}>
                  {getTeamDisplayName(match.team1Id)}
                </option>
                <option value={match.team2Id}>
                  {getTeamDisplayName(match.team2Id)}
                </option>
              </select>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={20} />
              Aggiorna Partita
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchForm;