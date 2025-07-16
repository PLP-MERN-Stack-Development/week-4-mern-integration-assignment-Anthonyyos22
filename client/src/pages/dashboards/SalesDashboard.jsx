import { useAuth } from '../../context/AuthContext';

const SalesDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Sales Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {user?.name}</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
      <div className="sales-features">
        <div className="feature-card">
          <h3>My Leads</h3>
          <p>View and manage your leads</p>
        </div>
        <div className="feature-card">
          <h3>Sales Targets</h3>
          <p>Track your sales performance</p>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;