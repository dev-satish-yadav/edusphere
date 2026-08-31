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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Institutions</h2>
          <p className="text-sm text-gray-500 mt-1">Manage tenant schools and colleges</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
          + Create Institution
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading institutions...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Institution Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Tenant ID / DB</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Admin Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutions?.map((inst: any) => (
                <tr key={inst._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{inst.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Slug: {inst.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-500 font-mono mb-1" title={inst.tenantId}>
                      ID: {inst.tenantId.substring(0, 8)}...
                    </p>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-mono">
                      {inst.dbName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{inst.adminName}</p>
                    <p className="text-xs text-gray-500">{inst.adminEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium mr-4">Edit</button>
                    <button className="text-sm text-emerald-600 hover:text-emerald-900 font-medium">Manage</button>
                  </td>
                </tr>
              ))}
              {(!institutions || institutions.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No institutions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
