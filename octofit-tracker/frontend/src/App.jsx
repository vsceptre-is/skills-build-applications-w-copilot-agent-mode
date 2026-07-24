import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function HomePage() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const previewUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h1 className="card-title mb-3">OctoFit Tracker</h1>
        <p className="card-text text-muted">
          This React 19 presentation tier connects to the Node.js API using Vite environment variables.
        </p>
        <div className="alert alert-info" role="status">
          Define <strong>VITE_CODESPACE_NAME</strong> in <strong>.env.local</strong> for Codespaces support.
          Example: <code>VITE_CODESPACE_NAME=your-codespace-name</code>
        </div>
        <p className="small text-muted">
          Preview URL example: <span className="fw-semibold">{previewUrl}</span>
        </p>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <nav className="nav nav-pills flex-wrap gap-2 mb-4">
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
            <NavLink className="nav-link" to="/activities">
              Activities
            </NavLink>
            <NavLink className="nav-link" to="/teams">
              Teams
            </NavLink>
            <NavLink className="nav-link" to="/leaderboard">
              Leaderboard
            </NavLink>
            <NavLink className="nav-link" to="/workouts">
              Workouts
            </NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
