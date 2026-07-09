import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { ToastProvider, useToast } from './components/Toast';
import { SavedAnalysis } from './types';

// Page Views
import { HomeView } from './pages/HomeView';
import { DashboardView } from './pages/DashboardView';
import { NewAnalysisView } from './pages/NewAnalysisView';
import { HistoryView } from './pages/HistoryView';
import { ReportsView } from './pages/ReportsView';
import { SettingsView } from './pages/SettingsView';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eco-manufacture-theme');
    return saved ? saved === 'dark' : true; // Defaults to dark theme
  });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // 1. Synchronize Dark Mode Class on body and html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('eco-manufacture-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('eco-manufacture-theme', 'light');
    }
  }, [darkMode]);

  // 2. Fetch Historical Audits on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json() as SavedAnalysis[];
          setHistory(data);
          if (data.length > 0) {
            setSelectedAnalysis(data[0]); // Load newest assessment as default
          }
        }
      } catch (error) {
        console.error('Failed to load history registry:', error);
      }
    };
    fetchHistory();
  }, []);

  // 3. Callback handlers
  const handleAnalysisComplete = (record: SavedAnalysis) => {
    setHistory((prev) => [record, ...prev]);
    setSelectedAnalysis(record);
    setCurrentPage('dashboard'); // Redirect to dashboard
  };

  const handleDeleteAnalysis = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const handleClearHistory = async () => {
    try {
      // Delete all records individually on backend
      for (const item of history) {
        await fetch(`/api/history/${item.id}`, { method: 'DELETE' });
      }
      setHistory([]);
      setSelectedAnalysis(null);
      setCurrentPage('home');
    } catch (err) {
      toast('error', 'Wipe Failed', 'Unable to fully clear historical records.');
    }
  };

  // 4. Export CSV Utility
  const handleExportCSV = (record: SavedAnalysis) => {
    const breakdown = record.result.emissionBreakdown;
    const total = record.result.estimatedCO2;

    const rows = [
      ['Category', 'Scope Class', 'Annual Emissions (Metric Tons CO2e)', 'Percentage Contribution (%)'],
      ['Grid Electricity', 'Scope 2', breakdown.electricity, total > 0 ? Math.round((breakdown.electricity / total) * 100) : 0],
      ['Stationary Fuels', 'Scope 1', breakdown.fuel, total > 0 ? Math.round((breakdown.fuel / total) * 100) : 0],
      ['Freight Logs', 'Scope 1', breakdown.transport, total > 0 ? Math.round((breakdown.transport / total) * 100) : 0],
      ['Raw Materials', 'Scope 3', breakdown.rawMaterials, total > 0 ? Math.round((breakdown.rawMaterials / total) * 100) : 0],
      ['Waste Management', 'Scope 3', breakdown.waste, total > 0 ? Math.round((breakdown.waste / total) * 100) : 0],
      ['Aggregate Annual Footprint', 'Total', total, '100']
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Carbon_Audit_${record.input.factoryName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('success', 'Export Success', 'Carbon emissions ledger downloaded in CSV format.');
  };

  // 5. Export PDF Utility
  const handleExportPDF = (record: SavedAnalysis) => {
    setSelectedAnalysis(record);
    setCurrentPage('reports');
    toast('info', 'Print Assistant', 'Loading report. Press "Print / Export PDF" inside the report view.');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0c0e14] dark:text-[#f5f5f5] flex flex-col md:flex-row transition-colors duration-300 relative overflow-hidden">
      
      {/* Sidebar Panel */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Ambient background blur blobs for Frosted Glass theme */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/8 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[0%] left-[-5%] w-[400px] h-[400px] bg-blue-500/4 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
        
        {/* Header Block */}
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          currentPage={currentPage}
        />

        {/* Dynamic loading backdrop screen */}
        {loading && <Loader />}

        {/* Content canvas container */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto relative z-10">
          {currentPage === 'home' && (
            <HomeView 
              onNavigateToNew={() => setCurrentPage('new-analysis')} 
              onNavigateToDashboard={() => setCurrentPage('dashboard')}
              hasHistory={history.length > 0}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView 
              history={history}
              selectedAnalysis={selectedAnalysis}
              onSelectAnalysis={setSelectedAnalysis}
              onNavigateToNew={() => setCurrentPage('new-analysis')}
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentPage === 'new-analysis' && (
            <NewAnalysisView 
              onAnalysisComplete={handleAnalysisComplete}
              setLoading={setLoading}
            />
          )}

          {currentPage === 'history' && (
            <HistoryView 
              history={history}
              onSelectAnalysis={(a) => {
                setSelectedAnalysis(a);
                setCurrentPage('dashboard');
              }}
              onDeleteAnalysis={handleDeleteAnalysis}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView 
              history={history}
              selectedAnalysis={selectedAnalysis}
              onSelectAnalysis={setSelectedAnalysis}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView 
              onClearHistory={handleClearHistory}
              historyCount={history.length}
            />
          )}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
