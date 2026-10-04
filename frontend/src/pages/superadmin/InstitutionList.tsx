import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
// @ts-ignore
import { Building2, School, GraduationCap, BookOpen, Target, Settings } from 'lucide-react';
import { api } from '../../services/api';

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'SCHOOL':
      return {
        icon: School,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
      };
    case 'COLLEGE':
      return {
        icon: GraduationCap,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
      };
    case 'TUITION':
      return {
        icon: BookOpen,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80',
      };
    case 'COACHING':
      return {
        icon: Target,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80',
      };
    default:
      return {
        icon: Building2,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
      };
  }
};

export const InstitutionList = () => {
  const { data: institutions, isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const response = await api.get('/institutions');
      return response.data.data || response.data;
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative pb-12">
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Institutions</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage tenant schools and colleges</p>
        </div>
        <Link 
          to="/institutions/create"
          className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
        >
          + Create Institution
        </Link>
      </div>

      {/* Grid Container */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#059669] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading institutions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {institutions?.map((inst: any) => {
            const config = getTypeConfig(inst.type);
            const Icon = config.icon;
            
            return (
              <Link 
                key={inst._id} 
                to={`/institutions/${inst._id}`}
                className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
              >
                
                {/* Image Header */}
                <div className="h-28 w-full relative overflow-hidden bg-gray-100">
                  <img 
                    src={config.img} 
                    alt={inst.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Icon size={12} className={config.color} />
                    <span className="text-[9px] font-extrabold text-gray-700 uppercase tracking-widest">{inst.type}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 text-[14px]" title={inst.name}>
                    {inst.name}
                  </h3>
                  
                  <div className="flex flex-col space-y-1">
                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                      {inst.adminName}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end items-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <button className="text-[12px] font-bold text-[#059669] hover:text-emerald-700 flex items-center gap-1">
                      Manage <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>
                </div>

              </Link>
            );
          })}
          
          {(!institutions || institutions.length === 0) && (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No institutions have been provisioned yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
