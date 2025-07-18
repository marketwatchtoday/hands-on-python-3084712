import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Trophy, Users, Calendar } from 'lucide-react';

// Import components
import TournamentList from './components/TournamentList';
import TournamentDetail from './components/TournamentDetail';
import TeamManagement from './components/TeamManagement';
import MatchSchedule from './components/MatchSchedule';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>🎾 Tennis Tournament Manager - Doppio Misto</h1>
          </div>
        </header>

        <nav className="nav">
          <div className="container">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" className="nav-link" end>
                  <Trophy size={20} />
                  Tornei
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/teams" className="nav-link">
                  <Users size={20} />
                  Squadre
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/schedule" className="nav-link">
                  <Calendar size={20} />
                  Calendario
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<TournamentList />} />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
            <Route path="/teams" element={<TeamManagement />} />
            <Route path="/schedule" element={<MatchSchedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;