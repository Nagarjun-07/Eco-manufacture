import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  FileSpreadsheet, 
  Download,
  AlertTriangle,
  Building2,
  Trash
} from 'lucide-react';
import { SavedAnalysis, IndustryType } from '../types';
import { useToast } from '../components/Toast';

interface HistoryViewProps {
  history: SavedAnalysis[];
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onExportCSV: (analysis: SavedAnalysis) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onExportCSV,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { toast } = useToast();

  const industries = ['All', 'Steel', 'Textile', 'Food', 'Chemical', 'Automobile', 'Electronics', 'Plastic', 'Paper', 'Cement', 'Others'];

  // Filter logic
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.input.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustry === 'All' || item.input.industryType === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const getScoreColor = (score: string) => {
    if (score === 'Green') return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50';
    if (score === 'Yellow') return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50';
    return 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50';
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the analysis record for "${name}"?`)) {
      try {
        const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
        if (res.ok) {
          onDeleteAnalysis(id);
          toast('success', 'Analysis Deleted', `Record for ${name} removed from registry.`);
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        toast('error', 'Deletion Failed', 'Unable to remove record from system database.');
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl max-w-7xl mx-auto space-y-6">
      
      {/* Title block */}
      <div className="border-b border-gray-200/20 dark:border-white/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
            Footprint History Registry
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            Audit logs and historical environmental calculations of registered manufacturing sites.
          </p>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-400 font-mono">
          Total Audited: <span className="font-bold text-emerald-600 dark:text-emerald-400">{history.length} factories</span>
        </div>
      </div>

      {/* Search and Filters Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        
        {/* Search input */}
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search factories, locations, or product types..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page
            }}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Industry filter */}
        <div className="sm:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
          <select
            value={selectedIndustry}
            onChange={(e) => {
              setSelectedIndustry(e.target.value);
              setCurrentPage(1); // Reset page
            }}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind} Industry</option>
            ))}
          </select>
        </div>

      </div>

      {/* History table */}
      {paginatedHistory.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200/40 dark:border-white/5 rounded-2xl bg-white/10 dark:bg-white/5">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No factory audits found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting search queries or run a new operational audit.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200/20 dark:border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 dark:bg-black/30 border-b border-gray-200/20 dark:border-white/5">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Facility Coordinates</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Sector / Type</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Est. Emissions</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Score Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider">Created Date</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase font-mono tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
              {paginatedHistory.map((item) => (
                <tr 
                  key={item.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  {/* Facility coordinates */}
                  <td className="p-4">
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block font-display">
                        {item.input.factoryName}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {item.input.location}
                      </span>
                    </div>
                  </td>

                  {/* Sector */}
                  <td className="p-4">
                    <div>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold font-mono rounded">
                        {item.input.industryType}
                      </span>
                      <span className="text-xs text-gray-400 block mt-1">
                        {item.input.productName}
                      </span>
                    </div>
                  </td>

                  {/* Estimated emissions */}
                  <td className="p-4 font-mono text-sm font-bold text-gray-950 dark:text-gray-100">
                    {Math.round(item.result.estimatedCO2 * 10) / 10} t/yr
                  </td>

                  {/* Score */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full ${getScoreColor(item.result.carbonScore)}`}>
                      {item.result.carbonScore.toUpperCase()}
                    </span>
                  </td>

                  {/* Created date */}
                  <td className="p-4 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions column */}
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onSelectAnalysis(item)}
                      className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-all"
                      title="Load and View on Dashboard"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExportCSV(item)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all"
                      title="Export CSV"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.input.factoryName)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80 pt-4 font-mono text-xs text-gray-400">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200/40 dark:border-slate-700/60 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200/40 dark:border-slate-700/60 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
