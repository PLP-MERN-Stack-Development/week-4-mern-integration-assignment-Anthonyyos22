import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      login(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error('Login failed');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Login</h2>
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="username"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="current-password"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
