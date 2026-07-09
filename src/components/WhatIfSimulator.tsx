import React, { useState, useEffect } from 'react';
import { Sliders, Zap, Leaf, Truck, RefreshCw, BarChart } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GeminiAnalysisResult } from '../types';

interface WhatIfSimulatorProps {
  originalResult: GeminiAnalysisResult;
  onSimulationChange?: (simulatedTotal: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ originalResult, onSimulationChange }) => {
  // Lever States
  const [elecReduction, setElecReduction] = useState(0); // 0% to 100% reduction in electricity demand
  const [renewableShare, setRenewableShare] = useState(originalResult.factoryBenchmark ? Math.round(originalResult.estimatedCO2 * 0.1) % 100 : 15); // Renewable share target % (Starts at a baseline or default)
  const [transportReduction, setTransportReduction] = useState(0); // 0% to 100% reduction in vehicle distance
  const [recycledShare, setRecycledShare] = useState(10); // Recycled material percentage

  // Initialize renewableShare with something sensible if benchmark exists
  useEffect(() => {
    setElecReduction(0);
    setTransportReduction(0);
  }, [originalResult]);

  // Original breakdown values (baseline)
  const baseElec = originalResult.emissionBreakdown.electricity;
  const baseFuel = originalResult.emissionBreakdown.fuel;
  const baseTransport = originalResult.emissionBreakdown.transport;
  const baseRaw = originalResult.emissionBreakdown.rawMaterials;
  const baseWaste = originalResult.emissionBreakdown.waste;
  const baseTotal = originalResult.estimatedCO2;

  // Recalculations
  // 1. Electricity: reduced by demand reduction, and offset by renewable energy share
  // (Renewable offset: 100% renewable = 0 emissions. So emissions scale with (100 - renewableShare)%)
  const simElec = Math.max(0, baseElec * (1 - elecReduction / 100) * ((100 - renewableShare) / 100));
  
  // 2. Transport: reduced directly by transport reduction
  const simTransport = Math.max(0, baseTransport * (1 - transportReduction / 100));

  // 3. Raw Materials: reduced slightly by increasing recycled material use (e.g. up to 25% reduction at 100% recycled)
  const rawMaterialAdjustmentFactor = 1 - (recycledShare / 100) * 0.35;
  const simRaw = Math.max(0, baseRaw * rawMaterialAdjustmentFactor);

  // Remaining values stay the same for this simulator
  const simFuel = baseFuel;
  const simWaste = baseWaste;

  const simTotal = simElec + simFuel + simTransport + simRaw + simWaste;
  const tonsSaved = Math.max(0, baseTotal - simTotal);
  const percentSaved = baseTotal > 0 ? (tonsSaved / baseTotal) * 100 : 0;

  useEffect(() => {
    if (onSimulationChange) {
      onSimulationChange(simTotal);
    }
  }, [simTotal, onSimulationChange]);

  const resetSimulator = () => {
    setElecReduction(0);
    setRenewableShare(20);
    setTransportReduction(0);
    setRecycledShare(10);
  };

  const chartData = [
    { name: 'Grid Elec', Baseline: Math.round(baseElec * 10) / 10, Simulated: Math.round(simElec * 10) / 10 },
    { name: 'Fuel Use', Baseline: Math.round(baseFuel * 10) / 10, Simulated: Math.round(simFuel * 10) / 10 },
    { name: 'Transport', Baseline: Math.round(baseTransport * 10) / 10, Simulated: Math.round(simTransport * 10) / 10 },
    { name: 'Materials', Baseline: Math.round(baseRaw * 10) / 10, Simulated: Math.round(simRaw * 10) / 10 },
    { name: 'Waste Mgmt', Baseline: Math.round(baseWaste * 10) / 10, Simulated: Math.round(simWaste * 10) / 10 },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200/20 dark:border-white/5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-500" /> &quot;What-If&quot; Sustainability Simulator
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Adjust plant-wide operational changes to simulate direct footprint reductions.
          </p>
        </div>
        <button
          onClick={resetSimulator}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Levers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Block */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Slider 1: Electricity reduction */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Grid Energy Reduction
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                -{elecReduction}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={elecReduction}
              onChange={(e) => setElecReduction(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-400 leading-normal">
              Reduced energy demand via variable frequency drives (VFDs) and smart LED retrofitting.
            </p>
          </div>

          {/* Slider 2: Renewable energy share */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-500" /> Renewable Solar/Wind Share
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {renewableShare}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={renewableShare}
              onChange={(e) => setRenewableShare(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-400 leading-normal">
              On-site solar microgrid expansion or purchasing Power Purchase Agreements (PPAs).
            </p>
          </div>

          {/* Slider 3: Transportation efficiency */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" /> Transportation Distance Reduction
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                -{transportReduction}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={transportReduction}
              onChange={(e) => setTransportReduction(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-400 leading-normal">
              Route consolidated distribution logs, localized warehousing, and rail freight swapping.
            </p>
          </div>

          {/* Slider 4: Recycled Material Use */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-teal-500" /> Recycled Material Input Share
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">
                {recycledShare}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={recycledShare}
              onChange={(e) => setRecycledShare(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-400 leading-normal">
              Switching raw materials input to pre-consumer or post-consumer circular supplies.
            </p>
          </div>

        </div>

        {/* Real-time Feedback & Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Key Simulation Results Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/20 dark:bg-white/5 p-5 rounded-2xl border border-gray-200/20 dark:border-white/5 backdrop-blur-sm">
            <div>
              <span className="text-xs text-gray-400 dark:text-gray-400 uppercase font-mono tracking-wider">Simulated Footprint</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-display mt-1">
                {Math.round(simTotal * 10) / 10} <span className="text-sm font-normal text-gray-500">t CO₂e/yr</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                Baseline: {Math.round(baseTotal * 10) / 10} t/yr
              </p>
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-400 uppercase font-mono tracking-wider">Estimated Carbon Cut</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-emerald-500 font-display">-{percentSaved.toFixed(1)}%</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-mono">
                  {Math.round(tonsSaved * 10) / 10} t/yr
                </span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-1">
                Equivalent to planting ~{Math.round(tonsSaved * 45)} trees annually!
              </p>
            </div>
          </div>

          {/* Quick Bar Chart comparing original and simulated */}
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '8px', 
                    color: '#f8fafc',
                    border: 'none',
                    fontSize: '11px'
                  }} 
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Baseline" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Simulated" fill="#10b981" radius={[2, 2, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
};
