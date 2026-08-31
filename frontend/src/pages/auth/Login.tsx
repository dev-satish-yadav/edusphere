import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is already logged in, redirect them to the dashboard immediately
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Real backend endpoint for Super Admin
      const response = await api.post('/admin/login', { email, password });
      const { user, token } = response.data.data;
      
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">EduSphere Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">System Initialization</p>
          <Link
            to="/create-super-admin"
            className="w-full block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition-colors"
          >
            Create Super Admin
          </Link>
        </div>
      </div>
    </div>
  );
};
