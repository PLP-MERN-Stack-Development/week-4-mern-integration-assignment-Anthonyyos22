import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import './AuthForm.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Registered successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error('Registration failed');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create Account</h2>
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoComplete="name"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
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
              autoComplete="new-password"
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FiShield className="text-gray-500 mr-2" />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-transparent outline-none"
            >
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
