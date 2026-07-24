import { useEffect, useState } from 'react';
import { getApiBaseUrl, normalizeResults } from '../utils/api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function loadActivities() {
      try {
        const response = await fetch(`${baseUrl}/api/activities/`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setActivities(normalizeResults(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();
    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Activities</h2>
        {loading && <p className="text-muted">Loading activities...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-muted">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity._id || `${activity.type}-${activity.date}`}>
                      <td>{activity.type}</td>
                      <td>{activity.durationMinutes} min</td>
                      <td>{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
