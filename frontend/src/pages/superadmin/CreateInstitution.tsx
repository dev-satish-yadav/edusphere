import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

export const CreateInstitution = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    type: 'SCHOOL',
    adminName: '',
    email: '',
    phone: '',
    address: '',
    plan: 'FREE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const response = await api.post('/institutions', formData);
      
      if (response.data.success || response.data) { // Assuming the backend sends a success response
        queryClient.invalidateQueries({ queryKey: ['institutions'] });
        navigate('/institutions');
      } else {
        setError(response.data.message || 'Failed to create institution');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while creating the institution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans pt-4">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/institutions" className="text-gray-400 hover:text-emerald-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Institution</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Provision a new tenant database and workspace</p>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Institution Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Institution Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Institution Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Springfield High School"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Institution Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium"
                    required
                  >
                    <option value="SCHOOL">School</option>
                    <option value="COLLEGE">College</option>
                    <option value="TUITION">Tuition / Learning Center</option>
                    <option value="COACHING">Coaching Institute</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Address (Optional)</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Physical address of the institution"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Admin Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Admin Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Admin Full Name</label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Principal or IT Admin Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@school.edu"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Subscription Plan</label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] focus:bg-white text-gray-800 transition-all font-medium"
                  >
                    <option value="FREE">Free Tier</option>
                    <option value="BASIC">Basic Plan</option>
                    <option value="PREMIUM">Premium Plan</option>
                    <option value="ENTERPRISE">Enterprise Plan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
              <Link
                to="/institutions"
                className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all inline-flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Provisioning Tenant...' : 'Create Institution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
