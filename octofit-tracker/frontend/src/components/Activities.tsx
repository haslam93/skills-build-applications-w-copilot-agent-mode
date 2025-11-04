import React, { useState, useEffect } from 'react';

interface Activity {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
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

  if (loading) return <div className="text-center">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Activities</h2>
      <div className="row">
        {activities.map((activity) => (
          <div key={activity.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{activity.type}</h5>
                <p className="card-text">
                  <strong>User:</strong> {activity.user?.name || 'Unknown'}<br />
                  <strong>Duration:</strong> {activity.duration} minutes<br />
                  <strong>Date:</strong> {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {activities.length === 0 && (
        <div className="text-center">
          <p>No activities found.</p>
        </div>
      )}
    </div>
  );
};

export default Activities;