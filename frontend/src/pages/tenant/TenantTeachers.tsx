import { useState } from 'react';
// @ts-ignore
import { Plus, Search, UserSquare2, Mail, Phone, BookOpen } from 'lucide-react';

export const TenantTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <UserSquare2 className="text-emerald-600" size={28} />
            Faculty Members
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage teachers, their subjects, and schedules</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium transition-all"
            />
          </div>
          <button className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center gap-2 flex-shrink-0">
            <Plus size={18} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <UserSquare2 size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Teachers Added Yet</h3>
        <p className="text-gray-500 font-medium max-w-md mb-6">
          Start building your faculty by adding your first teacher. You can assign them subjects and classes later.
        </p>
        <button className="bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-2.5 rounded-xl font-bold transition-all">
          Import from CSV
        </button>
      </div>

    </div>
  );
};
