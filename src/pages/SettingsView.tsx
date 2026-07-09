import React from 'react';
import { 
  Sliders, 
  Database, 
  Cpu, 
  User, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  ShieldAlert 
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface SettingsViewProps {
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClearHistory, historyCount }) => {
  const { toast } = useToast();

  const handleReset = async () => {
    if (confirm('Are you absolutely sure you want to clear all history records? This operation is irreversible.')) {
      // We can mock this by calling delete on each or simply clearing local client history which syncs back.
      // Wait, let's call onClearHistory.
      onClearHistory();
      toast('success', 'Registry Cleared', 'All industrial analyses have been wiped from the database.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. Developer Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2 border-b border-gray-200/20 dark:border-white/5 pb-4 mb-6">
          <User className="w-5 h-5 text-emerald-500" /> Engineering Profile & Expert Credentials
        </h3>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-3xl font-display flex items-center justify-center shadow-lg shadow-emerald-500/15 select-none shrink-0">
            NH
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">Nagarjun Harish</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider">
              Principal AI Engineer • Senior Full Stack Engineer • Sustainability Expert
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Leveraging 20+ years of full-stack engineering expertise combined with deep learning paradigms. Specializes in Scope 1, Scope 2, and Scope 3 Greenhouse Gas Compliance ledgers, automated lifecycle modeling, and prompt engineering protocols.
            </p>
          </div>
        </div>
      </div>

      {/* 2. System Database Configurations */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2 border-b border-gray-200/20 dark:border-white/5 pb-4 mb-6">
          <Database className="w-5 h-5 text-emerald-500" /> Database & Persistence Architecture
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/20 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-2xl backdrop-blur-sm">
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block">Active Database Driver</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 block flex items-center gap-1">
                <HardDrive className="w-4 h-4 text-emerald-500" /> Local Repository Mode (JSON DB)
              </span>
            </div>

            <div className="p-4 bg-white/20 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-2xl backdrop-blur-sm">
              <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block">Relational Pluggability</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 block font-mono">
                PostgreSQL / Spanner Adaptor Ready
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            The persistence engine leverages an abstract repository layout designed in `/server/db.ts`. You can plug in standard relational systems like PostgreSQL, Cloud SQL, Spanner, or SQLite with Drizzle ORM in seconds by replacing the storage adapters.
          </p>
        </div>
      </div>

      {/* 3. AI Model Preferences */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2 border-b border-gray-200/20 dark:border-white/5 pb-4 mb-6">
          <Cpu className="w-5 h-5 text-emerald-500" /> AI Engine Model Preference
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Gemini 3.5 Flash Model Configured</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                Utilizing `@google/genai` TypeScript SDK with structured output formatting enabled. Model temperature tuned to `0.2` for maximum factual consistency with standard EPA greenhouse gas coefficients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="glass-card border-rose-500/25 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-rose-600 font-display flex items-center gap-2 border-b border-gray-200/20 dark:border-white/5 pb-4 mb-6">
          <ShieldAlert className="w-5 h-5 text-rose-500" /> System Danger Zone
        </h3>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Wipe Factory Audits History</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Permanently clear all historical logs. Currently containing <span className="font-bold text-emerald-600">{historyCount} audits</span>.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear System Registry
          </button>
        </div>
      </div>

    </div>
  );
};
