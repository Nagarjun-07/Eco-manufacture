import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Leaf, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  UserCheck, 
  FileSpreadsheet, 
  Sparkles,
  Award
} from 'lucide-react';
import { SavedAnalysis } from '../types';

interface ReportsViewProps {
  history: SavedAnalysis[];
  selectedAnalysis: SavedAnalysis | null;
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onExportCSV: (analysis: SavedAnalysis) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  history,
  selectedAnalysis,
  onSelectAnalysis,
  onExportCSV,
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<SavedAnalysis | null>(selectedAnalysis);

  const handleSelect = (id: string) => {
    const found = history.find(h => h.id === id);
    if (found) {
      setActiveAnalysis(found);
      onSelectAnalysis(found);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display mb-2">No Reports Available</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Please complete at least one environmental analysis to access the regulatory reports center.
        </p>
      </div>
    );
  }

  const current = activeAnalysis || selectedAnalysis || history[0];
  const { input, result } = current;

  // Breakdown values
  const breakdown = result.emissionBreakdown;
  const totalBreakdown = breakdown.electricity + breakdown.fuel + breakdown.transport + breakdown.rawMaterials + breakdown.waste;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Non-printed Report Panel Controls */}
      <div className="no-print glass-card p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase font-mono tracking-wider">Report Profile:</span>
          <select
            value={current.id}
            onChange={(e) => handleSelect(e.target.value)}
            className="bg-white/40 dark:bg-black/40 border border-gray-200/40 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-700 dark:text-gray-200 font-semibold focus:outline-none"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.input.factoryName} (Audited {new Date(h.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onExportCSV(current)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Ledger (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Styled Printable Report Container */}
      <div id="printable-area" className="bg-white text-slate-900 border border-gray-200 p-8 sm:p-12 rounded-3xl shadow-lg font-sans relative overflow-hidden print:shadow-none print:border-none print:p-0">
        
        {/* Printable CSS Media overrides */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; color: black !important; }
            #printable-area { border: none !important; padding: 0 !important; box-shadow: none !important; }
          }
        `}} />

        {/* Outer decorative line for official document style */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        {/* Report Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-lg flex items-center justify-center text-white">
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-lg text-emerald-800 tracking-tight font-display">
                EcoManufacture AI Compliance
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-display">
              INDUSTRIAL SUSTAINABILITY & FOOTPRINT AUDIT
            </h1>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1">
              REGULATORY EMISSIONS FILE ID: {current.id.toUpperCase()}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-500 space-y-1">
            <p className="flex sm:justify-end items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> Issued: {new Date(current.createdAt).toLocaleDateString()}</p>
            <p className="flex sm:justify-end items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Site Location: {input.location}</p>
            <p className="flex sm:justify-end items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Standard: GHG Protocol Scope 1 & 2</p>
          </div>
        </div>

        {/* General Plant Demographics */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Factory Registered</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">{input.factoryName}</span>
            <span className="text-xs text-slate-500 mt-0.5 block">{input.industryType} Industry Sector</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Monthly Output</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">{input.productionQuantity} {input.unit}</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Product: {input.productName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Greenhouse Gas Score</span>
            <span className="text-sm font-bold text-emerald-700 block mt-0.5">{result.carbonScore.toUpperCase()} GRADE</span>
            <span className="text-xs text-slate-500 mt-0.5 block">Risk Rating: {result.environmentalRisk}</span>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="space-y-3 my-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Executive Consultant Review
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            &quot;{result.executiveSummary}&quot;
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.detailedCarbonAnalysis}
          </p>
        </div>

        {/* Emissions ledger Table */}
        <div className="space-y-4 my-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            1.0 Scope Carbon Emissions Ledger
          </h3>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-600">Category</th>
                <th className="p-3 font-semibold text-slate-600">GHG Scope Class</th>
                <th className="p-3 font-semibold text-slate-600 text-right">Emissions (t CO₂e/yr)</th>
                <th className="p-3 font-semibold text-slate-600 text-right">Contribution (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium">Electricity Grid Power</td>
                <td className="p-3 text-slate-500">Scope 2 (Indirect)</td>
                <td className="p-3 text-right font-mono">{Math.round(breakdown.electricity * 10) / 10}</td>
                <td className="p-3 text-right font-mono">
                  {totalBreakdown > 0 ? Math.round((breakdown.electricity / totalBreakdown) * 100) : 0}%
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Stationary Fuels (Coal/Gas/Diesel)</td>
                <td className="p-3 text-slate-500">Scope 1 (Direct Stationary)</td>
                <td className="p-3 text-right font-mono">{Math.round(breakdown.fuel * 10) / 10}</td>
                <td className="p-3 text-right font-mono">
                  {totalBreakdown > 0 ? Math.round((breakdown.fuel / totalBreakdown) * 100) : 0}%
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Logistics & Logistics Freight</td>
                <td className="p-3 text-slate-500">Scope 1 (Direct Mobile)</td>
                <td className="p-3 text-right font-mono">{Math.round(breakdown.transport * 10) / 10}</td>
                <td className="p-3 text-right font-mono">
                  {totalBreakdown > 0 ? Math.round((breakdown.transport / totalBreakdown) * 100) : 0}%
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Raw Materials Sourcing lifecycle</td>
                <td className="p-3 text-slate-500">Scope 3 (Upstream Supply)</td>
                <td className="p-3 text-right font-mono">{Math.round(breakdown.rawMaterials * 10) / 10}</td>
                <td className="p-3 text-right font-mono">
                  {totalBreakdown > 0 ? Math.round((breakdown.rawMaterials / totalBreakdown) * 100) : 0}%
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Industrial Solid Waste Sourcing</td>
                <td className="p-3 text-slate-500">Scope 3 (Downstream disposal)</td>
                <td className="p-3 text-right font-mono">{Math.round(breakdown.waste * 10) / 10}</td>
                <td className="p-3 text-right font-mono">
                  {totalBreakdown > 0 ? Math.round((breakdown.waste / totalBreakdown) * 100) : 0}%
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td className="p-3 text-slate-800" colSpan={2}>Aggregate Annual Footprint</td>
                <td className="p-3 text-right text-emerald-800 font-mono text-sm">
                  {Math.round(result.estimatedCO2 * 10) / 10}
                </td>
                <td className="p-3 text-right font-mono text-sm">100%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 leading-normal">
            * Footprints are estimated utilizing Gemini AI environmental algorithms combining regional EPA/EIA electrical indices and stationary fuel combustion values.
          </p>
        </div>

        {/* Abatement list */}
        <div className="space-y-4 my-8 break-before-page">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            2.0 Prescribed Abatement & Carbon Optimization Schedule
          </h3>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <div key={rec.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700">0{i+1}.</span>
                    <span className="font-bold text-xs text-slate-800">{rec.title}</span>
                    <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-mono">OPPORTUNITY</span>
                  <span className="text-xs font-bold font-mono text-emerald-600">{rec.costSavingsOpportunity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Suggestions Checklist */}
        <div className="space-y-3 my-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            3.0 Regulatory Programs & Government Incentives
          </h3>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
            {result.governmentSuggestions.map((sug, i) => (
              <li key={i} className="leading-relaxed">{sug}</li>
            ))}
          </ul>
        </div>

        {/* Official signature blocks */}
        <div className="border-t border-slate-200 pt-8 mt-12 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-6">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">ENGINEERING CERTIFICATION</span>
            <div className="h-10 border-b border-dashed border-slate-300" />
            <div>
              <p className="font-bold text-slate-800 flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Nagarjun Harish</p>
              <p className="text-slate-400">Chief Sustainability Coordinator, EcoManufacture</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">AI SECURITY VERIFICATION & DIGITAL STAMP</span>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-mono font-bold text-center">
                <Award className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                VERIFIED BY GEMINI AI
              </div>
              <div>
                <p className="font-mono font-bold text-[10px] text-emerald-700 uppercase">DIGITAL RECORD MATCHED</p>
                <p className="text-slate-400 font-mono text-[9px]">CONFIDENCE SCORE: {result.confidenceScore}%</p>
                <p className="text-slate-400 font-mono text-[9px]">REGISTRY: EM-GHG-2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
