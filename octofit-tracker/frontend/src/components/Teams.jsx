import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

function normalizeResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function loadTeams() {
      try {
        const response = await fetch(`/api/teams/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setTeams(normalizeResults(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeams();
    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Teams</h2>
        {loading && <p className="text-muted">Loading teams...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {teams.length === 0 ? (
              <p className="text-muted">No teams found.</p>
            ) : (
              teams.map((team) => (
                <div key={team._id || team.name} className="col">
                  <div className="border rounded p-3 h-100">
                    <h3 className="h6 mb-2">{team.name}</h3>
                    <p className="small text-muted mb-0">Members: {team.members?.length || 0}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
