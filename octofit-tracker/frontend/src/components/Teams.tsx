import React, { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev`
        : 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/teams/`;
      
      console.log('Fetching teams from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Teams data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsData = data.results ? data.results : data;
      setTeams(teamsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading teams...</span>
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger error-alert">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">👥 Teams</h1>
      <div className="table-container">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{width: '80px'}}>ID</th>
              <th>Team Name</th>
              <th style={{width: '120px'}}>Status</th>
              <th style={{width: '150px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>
                  <span className="badge bg-secondary">{team.id}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {team.name === 'Marvel' ? '🕷️' : team.name === 'DC' ? '🦸' : '👥'}
                    </div>
                    <div>
                      <strong className="fs-5">{team.name}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge bg-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {teams.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-people" style={{fontSize: '3rem', color: '#6c757d'}}></i>
          </div>
          <h4 className="text-muted">No teams found</h4>
          <p className="text-muted">Create your first team to get started!</p>
          <button className="btn btn-custom">Create Team</button>
        </div>
      )}
    </div>
  );
};

export default Teams;