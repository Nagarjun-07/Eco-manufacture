import React, { useState } from 'react';
import { 
  Leaf, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  PlusCircle, 
  Download, 
  Printer, 
  Gauge, 
  Percent, 
  Zap, 
  Trash, 
  Truck, 
  Flame, 
  Activity, 
  Sparkles, 
  Database 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { SavedAnalysis, GeminiAnalysisResult } from '../types';
import { WhatIfSimulator } from '../components/WhatIfSimulator';

interface DashboardViewProps {
  history: SavedAnalysis[];
  selectedAnalysis: SavedAnalysis | null;
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onNavigateToNew: () => void;
  onExportPDF: (analysis: SavedAnalysis) => void;
  onExportCSV: (analysis: SavedAnalysis) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  selectedAnalysis,
  onSelectAnalysis,
  onNavigateToNew,
  onExportPDF,
  onExportCSV,
}) => {
  const [simulatedTotal, setSimulatedTotal] = useState<number | null>(null);

  if (!selectedAnalysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="relative mb-6 inline-block">
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-xl w-20 h-20 -m-1" />
          <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto">
            <Leaf className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-display mb-3">
          Welcome to EcoManufacture AI Hub
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          No manufacturing analysis exists in your historical repository yet. Run your first audit to generate custom Scope 1 & 2 carbon footprints, cost savings, and AI-powered recommendations.
        </p>
        <button
          onClick={onNavigateToNew}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/15 transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Conduct First Analysis
        </button>
      </div>
    );
  }

  const { input, result } = selectedAnalysis;
  const simulatedCO2 = simulatedTotal !== null ? simulatedTotal : result.estimatedCO2;

  // Pie chart emission breakdown
  const pieData = [
    { name: 'Grid Electricity', value: result.emissionBreakdown.electricity, color: '#f59e0b' },
    { name: 'Stationary Fuel', value: result.emissionBreakdown.fuel, color: '#ef4444' },
    { name: 'Freight Logs', value: result.emissionBreakdown.transport, color: '#3b82f6' },
    { name: 'Raw Materials', value: result.emissionBreakdown.rawMaterials, color: '#0d9488' },
    { name: 'Waste Mgmt', value: result.emissionBreakdown.waste, color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Benchmarking Comparative Chart
  const benchmarkData = [
    { name: 'Your Plant', Intensity: result.factoryBenchmark.factoryIntensity, color: '#10b981' },
    { name: 'Sector Avg', Intensity: result.factoryBenchmark.industryAverageIntensity, color: '#94a3b8' },
  ];

  // Logic to show badges based on score
  const getScoreBadge = (score: string) => {
    switch (score) {
      case 'Green':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold font-mono border border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            🟢 GREEN SCORE
          </span>
        );
      case 'Yellow':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold font-mono border border-amber-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            🟡 YELLOW SCORE
          </span>
        );
      case 'Red':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold font-mono border border-rose-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            🔴 URGENT RED SCORE
          </span>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded text-[10px] font-bold font-mono">
            LOW RISK
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-bold font-mono">
            MEDIUM RISK
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded text-[10px] font-bold font-mono">
            HIGH RISK
          </span>
        );
      default:
        return null;
    }
  };

  const scoreClass = () => {
    if (result.carbonScore === 'Green') return 'pulse-glow-green border-emerald-500/20';
    if (result.carbonScore === 'Yellow') return 'pulse-glow-yellow border-amber-500/20';
    return 'pulse-glow-red border-rose-500/20';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Upper selector & Export ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono tracking-wider">Active Analysis:</span>
          <select
            value={selectedAnalysis.id}
            onChange={(e) => {
              const selected = history.find(h => h.id === e.target.value);
              if (selected) onSelectAnalysis(selected);
            }}
            className="bg-white/40 dark:bg-black/40 border border-gray-200/40 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 font-semibold focus:outline-none"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.input.factoryName} ({new Date(h.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCSV(selectedAnalysis)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => onExportPDF(selectedAnalysis)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF / Print
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Total CO2 footprint */}
        <div className="glass-card rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xs font-bold text-gray-400 dark:text-gray-400 font-mono uppercase tracking-wider block">Est. Annual CO₂e</span>
          <p className="text-3xl font-black text-gray-900 dark:text-white font-display mt-2 leading-none">
            {Math.round(simulatedCO2 * 10) / 10} <span className="text-sm font-normal text-gray-500">t</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-2 flex items-center gap-1 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> scope 1 & 2 ghg protocol
          </p>
        </div>

        {/* KPI 2: Carbon Score */}
        <div className={`glass-card border-2 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all ${scoreClass()}`}>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-400 font-mono uppercase tracking-wider block">Carbon Score</span>
          <div className="mt-2.5">
            {getScoreBadge(result.carbonScore)}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-400 leading-tight mt-3">
            Based on metric tons emitted per unit product intensity compared to sector peers.
          </p>
        </div>

        {/* KPI 3: Environmental Risk */}
        <div className="glass-card rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xs font-bold text-gray-400 dark:text-gray-400 font-mono uppercase tracking-wider block">Environmental Risk</span>
          <div className="mt-2.5 flex items-center gap-2">
            {getRiskBadge(result.environmentalRisk)}
            {result.environmentalRisk === 'High' && <AlertTriangle className="w-4.5 h-4.5 text-rose-500 animate-bounce" />}
            {result.environmentalRisk === 'Low' && <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-400 leading-snug mt-3 line-clamp-2">
            {result.environmentalRiskExplanation}
          </p>
        </div>

        {/* KPI 4: Percentile Rating */}
        <div className="glass-card rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xs font-bold text-gray-400 dark:text-gray-400 font-mono uppercase tracking-wider block">Industry Rating</span>
          <p className="text-3xl font-black text-gray-900 dark:text-white font-display mt-2 leading-none">
            {result.factoryBenchmark.percentile}<span className="text-sm font-normal text-gray-500">th</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-2 font-mono flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-blue-500" /> Outperforming {result.factoryBenchmark.percentile}% of competitors
          </p>
        </div>

      </div>

      {/* AI Consulting Executive Summary Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-500/10 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-4 right-4 text-emerald-500/10 dark:text-emerald-500/20 pointer-events-none">
          <Sparkles className="w-20 h-20" />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">AI CONSULTANT EXECUTIVE INSIGHTS</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display mt-1">
              Assessment Summary for {input.factoryName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              {result.executiveSummary}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-4 bg-white/40 dark:bg-black/40 p-4 rounded-2xl border border-gray-200/20 dark:border-white/5 backdrop-blur-sm">
              <span className="font-bold text-gray-700 dark:text-gray-300">Detailed Carbon Analysis:</span> {result.detailedCarbonAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* Charts section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Emission Sources (Pie) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display">
              Emission Breakdowns by Source
            </h3>
            <p className="text-xs text-gray-400">Annual Scope 1 & 2 carbon distributions (Metric Tons CO₂e)</p>
          </div>

          <div className="h-[220px] w-full my-4">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">No emissions logged.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '8px', 
                      color: '#f8fafc',
                      border: 'none',
                      fontSize: '11px'
                    }} 
                  />
                  <ReLegend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white/30 dark:bg-white/5 p-4 rounded-2xl border border-gray-200/20 dark:border-white/5 text-xs text-gray-500">
            <span className="font-bold text-rose-500">Key Driver:</span> {result.mostPollutingActivity}
          </div>
        </div>

        {/* Chart 2: Future Prediction trajectory (Line) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display">
              Carbon Abatement Forecast (2026 - 2030)
            </h3>
            <p className="text-xs text-gray-400">Baseline trajectory versus fully optimized projection scenario (Tons/year)</p>
          </div>

          <div className="h-[230px] w-full my-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={result.futureReductionPrediction}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <ReTooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '8px', 
                    color: '#f8fafc',
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="baseline" name="Baseline (No Abatement)" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="projected" name="Projected (Optimized)" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between border-t border-gray-200/20 dark:border-white/5 pt-4">
            <span>Assessment Quality: {result.confidenceScore}% Confidence</span>
            <span>Based on regional Scope 1 emissions benchmarks</span>
          </div>
        </div>

      </div>

      {/* Comparative Intensity & Gauge Meter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Comparative Intensity (Bar) */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display mb-1">
            Sector Carbon Intensity Benchmarking
          </h3>
          <p className="text-xs text-gray-400 mb-6">Emissions intensity per unit manufactured product (kg CO₂e per {input.unit})</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <ReTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '8px', 
                      color: '#f8fafc',
                      border: 'none',
                      fontSize: '11px'
                    }} 
                  />
                  <Bar dataKey="Intensity" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {benchmarkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white/20 dark:bg-white/5 rounded-2xl border border-gray-200/20 dark:border-white/5 backdrop-blur-sm">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Competitiveness Summary</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-display leading-relaxed">
                  {result.factoryBenchmark.industryBenchmarkText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Gauges & Credits */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display">
              Utility Renewable & Recycled Ratios
            </h3>
            <p className="text-xs text-gray-400 mb-6">Percentage targets achieved versus industry ideal minimums</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Solar/wind indicator */}
            <div className="p-4 bg-white/20 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wide uppercase mb-3">Renewable Share</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* SVG Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="38" stroke="#10b981" strokeWidth="8" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - input.renewableEnergyPercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-gray-900 dark:text-white font-display block leading-none">{input.renewableEnergyPercent}%</span>
                  <span className="text-[9px] text-gray-400 block mt-1 font-mono">Solar/Wind</span>
                </div>
              </div>
            </div>

            {/* Recycled materials indicator */}
            <div className="p-4 bg-white/20 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono tracking-wide uppercase mb-3">Recycled Share</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* SVG Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="38" stroke="#14b8a6" strokeWidth="8" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - input.recycledMaterialPercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-gray-900 dark:text-white font-display block leading-none">{input.recycledMaterialPercent}%</span>
                  <span className="text-[9px] text-gray-400 block mt-1 font-mono">Circular Inputs</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4 p-4 border border-teal-500/20 bg-teal-500/10 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">
              Circular economies significantly diminish lifecycle Scope 3 carbon inputs.
            </p>
          </div>
        </div>

      </div>

      {/* Simulator Sandbox */}
      <WhatIfSimulator originalResult={result} onSimulationChange={(simValue) => setSimulatedTotal(simValue)} />

      {/* AI Recommendations Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="border-b border-gray-200/20 dark:border-white/5 pb-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" /> AI-Generated Abatement Action Plan
          </h3>
          <p className="text-xs text-gray-400">Tactical, high-impact recommendations sourced from environmental consultancy logic.</p>
        </div>

        <div className="space-y-4">
          {result.recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="p-5 rounded-2xl bg-white/20 dark:bg-white/5 border border-gray-200/20 dark:border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-emerald-500/30 transition-all backdrop-blur-sm"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold font-mono rounded">
                    {rec.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    rec.impactLevel === 'High' 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' 
                      : rec.impactLevel === 'Medium' 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}>
                    {rec.impactLevel} Impact
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white font-display">{rec.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{rec.description}</p>
              </div>

              <div className="shrink-0 bg-white/30 dark:bg-black/30 border border-gray-200/20 dark:border-white/5 p-3 rounded-xl flex flex-col justify-center min-w-[150px] text-center sm:text-right">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Est. Cost Opportunity</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                  {rec.costSavingsOpportunity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
