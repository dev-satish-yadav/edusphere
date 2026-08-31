import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

export const CreateSuperAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    secretCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/admin/create', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'superadmin',
        secretCode: formData.secretCode,
      });
      
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Failed to create Super Admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create Super Admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-sans p-4 sm:p-8">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side - Branding / Illustration */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl mb-6 shadow-md">
              E
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Initialize<br />EduSphere.
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              Create the master Super Admin account to configure and manage all tenant institutions on the platform.
            </p>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
          
          <div className="relative z-10 text-blue-200 text-sm font-medium">
            © {new Date().getFullYear()} EduSphere. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Logo */}
          <div className="lg:hidden w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-md">
            E
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">System Setup</h2>
            <p className="text-gray-500 font-medium text-sm">Configure the root administrator credentials.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@edusphere.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Secret Initialization Code</label>
              <input
                type="password"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                placeholder="Enter master code"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400 tracking-widest"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Super Admin'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already initialized?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Return to Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
