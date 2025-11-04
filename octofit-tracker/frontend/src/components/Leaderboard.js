import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const sortedData = leaderboardData.sort((a, b) => b.points - a.points);
      setLeaderboard(sortedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading leaderboard...</span>
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger error-alert">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">🏆 Leaderboard</h1>
      <div className="table-container">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{width: '80px'}}>Rank</th>
              <th>Team</th>
              <th style={{width: '120px'}}>Points</th>
              <th style={{width: '120px'}}>Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id}>
                <td>
                  <span className={`badge fs-6 ${
                    index === 0 ? 'badge-rank-1' : 
                    index === 1 ? 'badge-rank-2' : 
                    index === 2 ? 'badge-rank-3' : 
                    'bg-primary'
                  }`}>
                    #{index + 1}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                    </div>
                    <div>
                      <strong className="fs-5">{entry.team?.name || 'Unknown Team'}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="fw-bold text-success fs-5">{entry.points}</span>
                </td>
                <td>
                  {index === 0 && <span className="badge bg-warning text-dark">Champion</span>}
                  {index === 1 && <span className="badge bg-secondary">Runner-up</span>}
                  {index === 2 && <span className="badge bg-info">Third Place</span>}
                  {index > 2 && <span className="badge bg-light text-dark">Competitor</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leaderboard.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-trophy" style={{fontSize: '3rem', color: '#6c757d'}}></i>
          </div>
          <h4 className="text-muted">No leaderboard data found</h4>
          <p className="text-muted">Start competing to see rankings!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;