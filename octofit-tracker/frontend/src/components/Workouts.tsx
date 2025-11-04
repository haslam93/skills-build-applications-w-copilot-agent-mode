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

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading workouts...</span>
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger error-alert">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">💪 Workouts</h1>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
            <div className="component-card card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title text-primary">{workout.name}</h5>
                  <span className="badge bg-secondary">#{workout.id}</span>
                </div>
                <p className="card-text flex-grow-1">{workout.description}</p>
                <div className="mt-auto">
                  <div className="mb-3">
                    <small className="text-muted">Suggested for:</small>
                    <br />
                    <span className={`badge ${
                      workout.suggested_for === 'Marvel' ? 'bg-danger' : 
                      workout.suggested_for === 'DC' ? 'bg-info' : 
                      'bg-primary'
                    }`}>
                      {workout.suggested_for}
                    </span>
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-custom btn-sm">
                      Start Workout
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {workouts.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-journal-text" style={{fontSize: '3rem', color: '#6c757d'}}></i>
          </div>
          <h4 className="text-muted">No workouts available</h4>
          <p className="text-muted">Create custom workouts to get started!</p>
          <button className="btn btn-custom">Create Workout</button>
        </div>
      )}
    </div>
  );
};

export default Workouts;