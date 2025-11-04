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

  if (loading) return <div className="text-center">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Teams</h2>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">
                  <strong>Team ID:</strong> {team.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {teams.length === 0 && (
        <div className="text-center">
          <p>No teams found.</p>
        </div>
      )}
    </div>
  );
};

export default Teams;