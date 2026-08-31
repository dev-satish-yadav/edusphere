import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useState, useRef, useEffect } from 'react';
import { getTenantSlug } from '../../utils/tenant';
// @ts-ignore
import { 
  Menu, ChevronDown, LayoutDashboard, Users, UserSquare2, 
  GraduationCap, ClipboardList, Settings, LogOut, User as UserIcon
} from 'lucide-react';

export const TenantLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const tenantSlug = getTenantSlug();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Dashboard', path: `/dashboard`, icon: LayoutDashboard },
    { name: 'Teachers', path: `/teachers`, icon: UserSquare2 },
    { name: 'Students', path: `/students`, icon: Users },
    { name: 'Classes', path: `/classes`, icon: GraduationCap },
    { name: 'Exams', path: `/exams`, icon: ClipboardList },
    { name: 'Settings', path: `/settings`, icon: Settings },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(`/login`);
  };

  return (
    <div className="h-screen bg-[#F4F7FE] flex flex-col font-sans overflow-hidden">
      
      {/* Top Header */}
      <header className="h-[76px] bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 transition-all">
        
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20">
              {tenantSlug?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-extrabold text-gray-900 text-base leading-tight tracking-tight capitalize">{tenantSlug?.replace('-', ' ')}</span>
              <span className="text-gray-500 text-[11px] font-medium leading-tight">Campus Management</span>
            </div>
          </div>
        </div>

        {/* Right: Profile Dropdown */}
        <div className="flex items-center justify-end flex-1 relative" ref={profileRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 pr-3 rounded-2xl transition-all border border-transparent hover:border-gray-100" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-tight">{user?.name || 'Staff Member'}</span>
              <span className="text-[11px] font-medium text-gray-500 leading-tight capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Staff'}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-[68px] right-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
              <div className="px-4 py-3 border-b border-gray-50 mb-2">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors">
                <UserIcon size={18} />
                My Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Body Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar */}
        <aside 
          className={`bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col pb-4 transition-all duration-300 ease-in-out relative z-10 ${
            isSidebarOpen ? 'w-[260px]' : 'w-[80px]'
          }`}
        >
          <div className="pt-8 pb-2 overflow-x-hidden flex flex-col h-full">
            <p className={`text-[11px] font-extrabold text-gray-400 tracking-widest mb-6 transition-all duration-300 ${
              isSidebarOpen ? 'px-6' : 'px-0 text-center opacity-0'
            }`}>
              {isSidebarOpen ? 'WORKSPACE' : '...'}
            </p>
            
            <ul className="space-y-2 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.path} className="relative group">
                    {isActive && (
                      <div className="absolute left-[-12px] top-1 bottom-1 w-1 bg-emerald-600 rounded-r-full shadow-[2px_0_8px_rgba(5,150,105,0.4)]"></div>
                    )}
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50/80 font-bold shadow-sm border border-emerald-100/50'
                          : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50 font-semibold'
                      }`}
                    >
                      <Icon size={22} className={`min-w-[22px] transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                      
                      <span className={`text-sm whitespace-nowrap transition-all duration-300 ${
                        isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'
                      }`}>
                        {item.name}
                      </span>
                    </Link>

                    {!isSidebarOpen && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-xl border border-gray-700">
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
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
