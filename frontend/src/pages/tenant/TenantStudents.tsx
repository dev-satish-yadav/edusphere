import { useState } from 'react';
// @ts-ignore
import { Plus, Search, Users, Filter } from 'lucide-react';

export const TenantStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" size={28} />
            Student Directory
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage enrollments, student records, and parents</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm font-medium transition-all"
            />
          </div>
          <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
             <Filter size={20} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center gap-2 flex-shrink-0">
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Enrolled</h3>
        <p className="text-gray-500 font-medium max-w-md mb-6">
          Your directory is currently empty. Start enrolling students manually or import them in bulk.
        </p>
        <button className="bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold transition-all">
          Bulk Enrollment
        </button>
      </div>

    </div>
  );
};
