import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
// @ts-ignore
import { ArrowLeft, Building2, Mail, Phone, MapPin, User, Activity, ExternalLink } from 'lucide-react';

export const InstitutionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const { data: inst, isLoading, refetch } = useQuery({
    queryKey: ['institution', id],
    queryFn: async () => {
      const response = await api.get(`/institutions/${id}`);
      const data = response.data.data || response.data;
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || ''
      });
      return data;
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/institutions/${id}`, formData);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Failed to update institution', error);
      alert('Failed to update institution. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!inst) {
    return (
      <div className="p-12 text-center h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Found</h2>
        <p className="text-gray-500 mb-6">The institution could not be found.</p>
        <button onClick={() => navigate('/institutions')} className="text-blue-600 font-bold hover:underline">
          Go back to list
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans pb-12 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/institutions')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Institutions
        </button>
        <div className="flex gap-3">
          <a 
            href={`http://${inst.slug}.localhost:5173`} 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <ExternalLink size={16} /> Visit Portal
          </a>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full"></div>
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center -mt-12 mb-4 border-4 border-white">
            <Building2 size={40} className="text-blue-600" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{inst.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm font-medium text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md uppercase tracking-wider text-[11px] font-bold">
                  {inst.type}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Activity size={14} className={inst.isActive ? 'text-emerald-500' : 'text-red-500'} />
                  {inst.isActive ? 'Active' : 'Inactive'}
                </span>
                <span>•</span>
                <span>Slug: {inst.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Institution Info Card */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 size={22} className="text-blue-600" />
            Institution Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-0.5">Institution Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 py-1 px-2 border"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{inst.name || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-0.5">Email Address</p>
                <p className="text-gray-900 font-medium">{inst.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-0.5">Contact Number</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 py-1 px-2 border"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{inst.phone || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-500 mb-0.5">Address</p>
                {isEditing ? (
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 py-1 px-2 border"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-900 font-medium leading-relaxed">{inst.address || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-0.5">Primary Administrator</p>
                <p className="text-gray-900 font-medium">{inst.adminName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
