import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {user?.name}</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
      <div className="manager-features">
        <div className="feature-card">
          <h3>Team Performance</h3>
          <p>View your team metrics</p>
        </div>
        <div className="feature-card">
          <h3>Reports</h3>
          <p>Generate sales reports</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;