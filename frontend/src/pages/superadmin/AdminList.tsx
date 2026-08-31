import { useQuery } from '@tanstack/react-query';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Admins</h2>
          <p className="text-sm text-gray-500 mt-1">Manage global super administrators</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
          + Create Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading admins...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins?.map((admin: any) => (
                <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{admin.name}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {(!admins || admins.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
