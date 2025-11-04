import React, { useState, useEffect } from 'react';

interface Team {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  team: Team;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const baseUrl = codespace 
        ? `https://${codespace}-8000.app.github.dev`
        : 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/users/`;
      
      console.log('Fetching users from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data received:', data);
      
      // Handle both paginated (.results) and plain array responses
      const usersData = data.results ? data.results : data;
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading users...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <div className="row">
        {users.map((user) => (
          <div key={user.id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Team:</strong> {user.team?.name || 'No Team'}<br />
                  <strong>User ID:</strong> {user.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center">
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default Users;