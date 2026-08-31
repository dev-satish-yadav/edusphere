import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

export const CreateAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    secretCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/create', { ...formData, role: 'admin' });
      
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        navigate('/admins');
      } else {
        setError(response.data.message || 'Failed to create admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans pt-4">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admins" className="text-gray-400 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Admin</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Register a new system administrator</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin2@edusphere.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Secret Initialization Code</label>
              <input
                type="password"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                placeholder="Enter master code"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400 tracking-widest"
                required
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">Required by system security protocol to authorize new admin creation.</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400 tracking-widest"
                required
                minLength={8}
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
              <Link
                to="/admins"
                className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all inline-flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
