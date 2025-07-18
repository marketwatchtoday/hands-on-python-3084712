import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const TournamentForm = ({ tournament, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    date: tournament?.date ? tournament.date.split('T')[0] : '',
    location: tournament?.location || '',
    maxTeams: tournament?.maxTeams || 16,
    status: tournament?.status || 'registration'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {tournament ? 'Modifica Torneo' : 'Nuovo Torneo'}
          </h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome del Torneo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="es. Torneo Primavera 2024"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Numero Massimo Squadre</label>
              <select
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                className="form-select"
              >
                <option value={8}>8 squadre</option>
                <option value={16}>16 squadre</option>
                <option value={32}>32 squadre</option>
                <option value={64}>64 squadre</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Località</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="es. Tennis Club Roma"
              required
            />
          </div>

          {tournament && (
            <div className="form-group">
              <label className="form-label">Stato</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="registration">Iscrizioni Aperte</option>
                <option value="active">In Corso</option>
                <option value="completed">Completato</option>
              </select>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={20} />
              {tournament ? 'Aggiorna' : 'Crea'} Torneo
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

export default TournamentForm;