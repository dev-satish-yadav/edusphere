import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { 
  Menu, ChevronDown, Building2, Users, LogOut, User as UserIcon
} from 'lucide-react';

export const SuperAdminLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Institutes', path: '/', icon: Building2 },
    { name: 'Admin', path: '/admins', icon: Users },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50 transition-all">
        
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-bold text-gray-800 text-[15px] leading-tight">EduSphere</span>
              <span className="text-gray-500 text-[11px] leading-tight">Super Admin</span>
            </div>
          </div>
        </div>

        {/* Right: Profile Dropdown */}
        <div className="flex items-center justify-end flex-1 relative" ref={profileRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Admin User'}</span>
              <span className="text-[11px] text-gray-500 leading-tight capitalize">{user?.role || 'Administrator'}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-[60px] right-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <UserIcon size={16} className="text-gray-400" />
                Profile
              </button>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} className="text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Body Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 flex flex-col pb-4 transition-all duration-300 ease-in-out relative z-10 ${
            isSidebarOpen ? 'w-[260px]' : 'w-[72px]'
          }`}
        >
          <div className="pt-6 pb-2 overflow-x-hidden flex flex-col h-full">
            <p className={`text-[11px] font-bold text-gray-400 tracking-wider mb-4 transition-all duration-300 ${
              isSidebarOpen ? 'px-6' : 'px-0 text-center opacity-0'
            }`}>
              {isSidebarOpen ? 'MAIN' : '...'}
            </p>
            
            <ul className="space-y-2 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path} className="relative group">
                    {isActive && (
                      <div className="absolute left-[-12px] top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                    )}
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'text-blue-700 bg-blue-50/50'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} className={`min-w-[20px] ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      
                      <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'
                      }`}>
                        {item.name}
                      </span>
                    </Link>

                    {/* Hover Tooltip for collapsed state */}
                    {!isSidebarOpen && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        {item.name}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
