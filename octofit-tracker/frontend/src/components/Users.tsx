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

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading users...</span>
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger error-alert">Error: {error}</div>;

  return (
    <div>
      <h1 className="page-title">👤 Users</h1>
      <div className="table-container">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{width: '80px'}}>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Team</th>
              <th style={{width: '150px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className="badge bg-secondary">{user.id}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                           style={{width: '40px', height: '40px', fontSize: '1.2rem'}}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <strong className="fs-6">{user.name}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <a href={`mailto:${user.email}`} className="text-decoration-none">
                    {user.email}
                  </a>
                </td>
                <td>
                  <span className={`badge ${
                    user.team?.name === 'Marvel' ? 'bg-danger' : 
                    user.team?.name === 'DC' ? 'bg-info' : 
                    'bg-secondary'
                  }`}>
                    {user.team?.name || 'No Team'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">
                    Profile
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-person-plus" style={{fontSize: '3rem', color: '#6c757d'}}></i>
          </div>
          <h4 className="text-muted">No users found</h4>
          <p className="text-muted">Add users to start tracking fitness activities!</p>
          <button className="btn btn-custom">Add User</button>
        </div>
      )}
    </div>
  );
};

export default Users;