import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Database, 
  FileBarChart2, 
  Sliders, 
  Leaf, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Operational overview' },
    { id: 'new-analysis', label: 'New Analysis', icon: PlusCircle, desc: 'Run sustainability engine' },
    { id: 'history', label: 'History Registry', icon: Database, desc: 'Footprint archive records' },
    { id: 'reports', label: 'Regulatory Reports', icon: FileBarChart2, desc: 'PDF, CSV & exports' },
    { id: 'settings', label: 'Settings', icon: Sliders, desc: 'Pref and developer notes' },
  ];

  const handleNav = (id: string) => {
    setCurrentPage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-gray-900 dark:text-white font-display tracking-tight text-sm">
            Eco Manufacture
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`fixed inset-y-0 left-0 transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static transition-transform duration-300 ease-in-out z-50 w-64 lg:w-72 bg-white/45 dark:bg-black/20 border-r border-gray-200/50 dark:border-white/10 backdrop-blur-xl flex flex-col justify-between h-screen`}>
        
        {/* Top brand header */}
        <div>
          <div className="p-6 border-b border-gray-200/40 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Leaf className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-black text-gray-900 dark:text-white font-display tracking-tight text-base leading-none block">
                  Eco Manufacture
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-bold block">
                  AI CARBON ENGINE
                </span>
              </div>
            </div>
            {/* Close button on mobile */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 mt-4">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-left relative group ${
                    isActive 
                      ? 'bg-white/60 text-emerald-900 dark:bg-white/10 dark:text-white font-semibold border border-white/40 dark:border-white/5 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/5'
                  }`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} />
                  
                  <div>
                    <span className="text-sm font-medium tracking-tight block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block leading-tight font-normal truncate max-w-[160px]">
                      {item.desc}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Context Footer */}
        <div className="p-4 border-t border-gray-200/40 dark:border-white/10 bg-transparent">
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block uppercase tracking-wider">
                Compliance Active
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate font-mono">
                Scope 1, 2 GHG Protocols
              </span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
