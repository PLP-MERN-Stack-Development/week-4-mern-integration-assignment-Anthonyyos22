import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'manager': return '/dashboard/manager';
      case 'sales': return '/dashboard/sales';
      default: return '/';
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  if (isLoading) {
    return (
      <nav className="navbar loading">
        <div className="container">
          <Link to="/" className="navbar-brand">MyApp</Link>
          <div className="nav-links">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">MyApp</Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {user && <Link to="/tasks" className="nav-link" onClick={() => setMenuOpen(false)}>Tasks</Link>}
          {user && <Link to="/posts" className="nav-link" onClick={() => setMenuOpen(false)}>Posts</Link>}

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {user ? (
            <>
              <span className="welcome-message">
                <span className="welcome-text">Welcome,</span>
                <span className="user-name">{user.name}</span>
                <span className="user-role">({user.role})</span>
              </span>
              <Link to={getDashboardLink()} className="nav-link dashboard-link" onClick={() => setMenuOpen(false)}>
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
