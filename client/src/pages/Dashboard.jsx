import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on role
    switch(user.role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'manager':
        navigate('/dashboard/manager');
        break;
      case 'sales':
        navigate('/dashboard/sales');
        break;
      default:
        navigate('/');
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything
};

export default Dashboard;