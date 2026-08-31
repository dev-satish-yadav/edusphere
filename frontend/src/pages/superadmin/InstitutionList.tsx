import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export const InstitutionList = () => {
  const { data: institutions, isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const response = await api.get('/institutions');
      return response.data;
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Institutions</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage tenant schools and colleges</p>
        </div>
        <button className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]">
          + Create Institution
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#059669] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading institutions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Institution Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tenant ID / DB</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {institutions?.map((inst: any) => (
                  <tr key={inst._id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg border border-gray-200 shadow-sm">
                          {inst.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{inst.name}</p>
                          <p className="text-[11px] font-medium text-gray-400 mt-0.5">Slug: {inst.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-gray-600 font-mono mb-1.5" title={inst.tenantId}>
                        ID: {inst.tenantId.substring(0, 8)}...
                      </p>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono shadow-sm">
                        {inst.dbName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{inst.adminName}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{inst.adminEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-gray-400 group-hover:text-blue-600 hover:!text-blue-800 font-semibold transition-colors mr-4">Edit</button>
                      <button className="text-sm text-gray-400 group-hover:text-[#059669] hover:!text-emerald-800 font-semibold transition-colors">Manage</button>
                    </td>
                  </tr>
                ))}
                {(!institutions || institutions.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No institutions found.
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
