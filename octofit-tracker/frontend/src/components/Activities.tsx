import React, { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
}

interface Activity {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    team?: Team;
  };
  type: string;
  duration: number;
  timestamp: string;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev`
        : 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/activities/`;
      
      console.log('Fetching activities from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activities data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesData = data.results ? data.results : data;
      setActivities(activitiesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading activities...</span>
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger error-alert">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">📊 Activities</h1>
      <div className="table-container">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Activity Type</th>
              <th>User</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>
                  <span className="badge bg-primary">{activity.type}</span>
                </td>
                <td>
                  <strong>{activity.user?.name || 'Unknown'}</strong>
                  <br />
                  <small className="text-muted">{activity.user?.email}</small>
                </td>
                <td>
                  <span className="fw-bold text-success">{activity.duration}</span> minutes
                </td>
                <td>
                  {new Date(activity.timestamp).toLocaleDateString()}
                  <br />
                  <small className="text-muted">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </small>
                </td>
                <td>
                  <span className="badge bg-secondary">
                    {activity.user?.team?.name || 'No Team'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {activities.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-clipboard-data" style={{fontSize: '3rem', color: '#6c757d'}}></i>
          </div>
          <h4 className="text-muted">No activities found</h4>
          <p className="text-muted">Start tracking your fitness activities!</p>
        </div>
      )}
    </div>
  );
};

export default Activities;