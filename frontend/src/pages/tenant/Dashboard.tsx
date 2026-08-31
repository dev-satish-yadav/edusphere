import { useAuthStore } from '../../store/auth.store';
import { getTenantSlug } from '../../utils/tenant';
// @ts-ignore
import { Users, UserSquare2, GraduationCap, TrendingUp } from 'lucide-react';

export const TenantDashboard = () => {
  const tenantSlug = getTenantSlug();
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Students', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Teachers', value: '0', icon: UserSquare2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Classes', value: '0', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Avg Attendance', value: '0%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
          </h1>
          <p className="text-gray-500 font-medium">
            Here is what's happening at <span className="capitalize font-bold text-emerald-700">{tenantSlug?.replace('-', ' ')}</span> today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <GraduationCap size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Classes Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-4">Start by creating your first class and enrolling students to see activity here.</p>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors">
            Create Class
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-50">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center h-48 text-center">
             <p className="text-sm font-medium text-gray-400">Activity stream is empty.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};
