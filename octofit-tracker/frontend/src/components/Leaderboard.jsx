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

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function loadLeaderboard() {
      try {
        const response = await fetch(`/api/leaderboard/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setEntries(normalizeResults(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();
    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Leaderboard</h2>
        {loading && <p className="text-muted">Loading leaderboard...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <ol className="list-group list-group-numbered">
            {entries.length === 0 ? (
              <li className="list-group-item text-muted">No leaderboard entries found.</li>
            ) : (
              entries.map((entry, index) => (
                <li key={entry._id || `${entry.username}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{entry.username}</span>
                  <span className="badge bg-primary rounded-pill">{entry.score}</span>
                </li>
              ))
            )}
          </ol>
        )}
      </div>
    </section>
  );
}
