import React from 'react';
import { 
  Sparkles, 
  Leaf, 
  Activity, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToNew: () => void;
  onNavigateToDashboard: () => void;
  hasHistory: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigateToNew, 
  onNavigateToDashboard, 
  hasHistory 
}) => {
  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl w-72 h-72 mx-auto -top-12 -z-10" />
        
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-wide">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          AI-Powered Industrial GHG Auditing
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white font-display leading-[1.1] tracking-tight">
          Decarbonize Your Manufacturing Pipeline with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Intelligent AI</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          The professional SaaS standard for automated Scope 1 & Scope 2 footprint reporting, predictive carbon abatement curves, and intelligent local regulatory compliance checks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onNavigateToNew}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/15 flex items-center gap-2 transition-all cursor-pointer text-sm"
          >
            Start Operational Audit <ArrowRight className="w-4 h-4" />
          </button>
          {hasHistory && (
            <button
              onClick={onNavigateToDashboard}
              className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl border border-gray-200 dark:border-slate-800 transition-all text-sm"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Dynamic AI-Powered Sustainability Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-bold text-emerald-400 font-mono tracking-widest">ACTIVE REGULATORY GUIDES</p>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-snug">
            Reason like an experienced environmental consultant, not just standard calculators.
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our models go beyond simple carbon math. We analyze the complete supply chain, electricity grids, raw material inputs, solid waste pathways, and region-specific regulatory frameworks.
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 rounded-2xl flex items-center gap-3 shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-left font-mono">
            <span className="text-xs font-bold text-emerald-400 block">EPA/GHG COMPLIANT</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">S1 & S2 protocols active</span>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-950 dark:text-white font-display">Core Platform Capabilities</h3>
          <p className="text-xs text-gray-400 mt-1">Built to professional SaaS design patterns including Stripe and Linear</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm font-display">Multi-Step Carbon Audits</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Step-by-step form wizards tracking factory grids, raw material weights, logistics freight paths, fuels, and solid hazard wastes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm font-display">What-If Simulation Sandbox</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Drag interactive sliders to model direct real-time emission savings under variable renewable shares and green shipping curves.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm font-display">Regulatory PDF / CSV Exports</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Generate fully formatted print sheets containing environmental balance ledgers, abatement curves, and officer sign-off fields.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
