import React, { useState, useEffect } from 'react';

interface Workout {
  id: number;
  name: string;
  description: string;
  suggested_for: string;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev`
        : 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/workouts/`;
      
      console.log('Fetching workouts from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Workouts data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const workoutsData = data.results ? data.results : data;
      setWorkouts(workoutsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Workouts</h2>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{workout.name}</h5>
                <p className="card-text">
                  <strong>Description:</strong> {workout.description}<br />
                  <strong>Suggested for:</strong> {workout.suggested_for}<br />
                  <strong>Workout ID:</strong> {workout.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {workouts.length === 0 && (
        <div className="text-center">
          <p>No workouts found.</p>
        </div>
      )}
    </div>
  );
};

export default Workouts;