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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] font-sans p-4 sm:p-8">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side - Branding / Illustration */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl mb-6 shadow-md">
              E
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Welcome to<br />EduSphere.
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              The all-in-one platform to manage your educational institution, streamlined for success.
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
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Logo */}
          <div className="lg:hidden w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-md">
            E
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Sign In</h2>
            <p className="text-gray-500 font-medium text-sm">Enter your email and password to access the portal.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edusphere.com"
                  className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-semibold">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400 tracking-widest"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Setup Link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              First time setup?{' '}
              <Link to="/create-super-admin" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Initialize Super Admin
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
