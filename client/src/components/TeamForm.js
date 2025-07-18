import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const TeamForm = ({ team, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    malePlayer: team?.malePlayer || '',
    femalePlayer: team?.femalePlayer || '',
    ranking: team?.ranking || ''
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
    onSubmit({
      ...formData,
      ranking: formData.ranking ? parseInt(formData.ranking) : 0
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {team ? 'Modifica Squadra' : 'Nuova Squadra'}
          </h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Giocatore Maschile</label>
            <input
              type="text"
              name="malePlayer"
              value={formData.malePlayer}
              onChange={handleChange}
              className="form-input"
              placeholder="es. Marco Rossi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Giocatrice Femminile</label>
            <input
              type="text"
              name="femalePlayer"
              value={formData.femalePlayer}
              onChange={handleChange}
              className="form-input"
              placeholder="es. Laura Bianchi"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ranking (opzionale)</label>
            <input
              type="number"
              name="ranking"
              value={formData.ranking}
              onChange={handleChange}
              className="form-input"
              placeholder="es. 1500"
              min="0"
            />
            <small style={{ color: '#666', fontSize: '0.9rem' }}>
              Il ranking può essere usato per il seeding nel tabellone
            </small>
          </div>

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary flex-1">
              <Save size={20} />
              {team ? 'Aggiorna' : 'Aggiungi'} Squadra
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

export default TeamForm;