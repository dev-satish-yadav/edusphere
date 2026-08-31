import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../services/api';
import { getTenantSlug } from '../../utils/tenant';

export const TenantLogin = () => {
  const tenantSlug = getTenantSlug();
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/tenant-auth/login', {
        slug: tenantSlug,
        ...formData
      });

      if (response.data.success) {
        setAuth(response.data.data.user, response.data.data.token);
        // We route them to the tenant dashboard on this subdomain
        navigate(`/dashboard`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-[45%] bg-[#059669] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#059669] font-bold text-2xl shadow-lg">
            E
          </div>
          <span className="text-white text-2xl font-extrabold tracking-tight">EduSphere</span>
        </div>

        <div className="relative z-10 text-white pb-12">
          <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Welcome to your<br />Digital Campus.
          </h1>
          <p className="text-emerald-100 text-lg max-w-md leading-relaxed font-medium">
            Log in to manage your institution's resources, students, and educators in one unified workspace.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Sign in</h2>
            <p className="text-gray-500 font-medium">
              Accessing workspace: <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{tenantSlug}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all font-medium placeholder-gray-400 text-gray-900 shadow-sm"
                placeholder="admin@school.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all font-medium placeholder-gray-400 text-gray-900 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign In to Campus'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-emerald-600 transition-colors">
              Are you a Super Admin? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
