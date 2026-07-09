import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, currentPage }) => {
  const [timeStr, setTimeStr] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Tick current time
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check backend connection health
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setApiStatus('online');
        else setApiStatus('offline');
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Carbon Dashboard';
      case 'new-analysis': return 'Environmental Assessment Builder';
      case 'history': return 'Footprint Registry';
      case 'reports': return 'Regulatory Reports & Exports';
      case 'settings': return 'System Configurations';
      default: return 'EcoManufacture';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/20 dark:bg-black/10 backdrop-blur-md border-b border-gray-200/30 dark:border-white/5 py-4 px-6 sm:px-8 flex items-center justify-between transition-colors duration-300">
      
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-400 font-mono hidden sm:block mt-0.5">
          EcoManufacture Hub • Active Scope 1 & 2 Workspace
        </p>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* System Time clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200/30 dark:border-white/5">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>{timeStr}</span>
        </div>

        {/* Database / Engine Health status */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'checking' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'checking' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono hidden lg:block">
            {apiStatus === 'online' ? 'Engine Online' : apiStatus === 'checking' ? 'Connecting Engine...' : 'Engine Disconnected'}
          </span>
        </div>

        {/* Dark Mode toggler */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg transition-all border border-transparent hover:border-gray-200/20"
          aria-label="Toggle visual theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
            N
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Nagarjun</p>
            <p className="text-[10px] text-gray-400 font-mono">Nagarjunharish07@gmail.com</p>
          </div>
        </div>

      </div>
    </header>
  );
};
