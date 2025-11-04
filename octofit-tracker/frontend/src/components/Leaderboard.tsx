import React, { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
}

interface LeaderboardEntry {
  id: number;
  team: Team;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev`
        : 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/leaderboard/`;
      
      console.log('Fetching leaderboard from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardData = data.results ? data.results : data;
      // Sort by points in descending order
      const sortedData = leaderboardData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points);
      setLeaderboard(sortedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id}>
                <td>
                  <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    #{index + 1}
                  </span>
                </td>
                <td>{entry.team?.name || 'Unknown Team'}</td>
                <td>{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leaderboard.length === 0 && (
        <div className="text-center">
          <p>No leaderboard data found.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;