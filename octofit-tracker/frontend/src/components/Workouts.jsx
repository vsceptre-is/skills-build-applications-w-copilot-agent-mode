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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function loadWorkouts() {
      try {
        const response = await fetch(`/api/workouts/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setWorkouts(normalizeResults(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();
    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Workouts</h2>
        {loading && <p className="text-muted">Loading workouts...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {workouts.length === 0 ? (
              <p className="text-muted">No workout found.</p>
            ) : (
              workouts.map((workout) => (
                <div key={workout._id || workout.name} className="col">
                  <div className="border rounded p-3 h-100">
                    <h3 className="h6 mb-2">{workout.name}</h3>
                    <p className="small text-muted mb-1">Duration: {workout.durationMinutes} min</p>
                    <p className="small text-muted mb-0">Difficulty: {workout.difficulty}</p>
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
