import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export const AdminList = () => {
  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await api.get('/admin/list');
      return response.data.data;
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative">
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Admins</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage global super administrators</p>
        </div>
        <Link 
          to="/admins/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
        >
          + Create Admin
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading admins...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins?.map((admin: any) => (
                  <tr key={admin._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-sm">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[11px] font-bold uppercase tracking-wider">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-gray-400 group-hover:text-blue-600 hover:!text-blue-800 font-semibold transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
                {(!admins || admins.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
