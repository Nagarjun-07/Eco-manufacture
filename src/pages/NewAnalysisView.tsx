import React, { useState } from 'react';
import { 
  Building2, 
  Leaf, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Activity, 
  Truck, 
  Flame, 
  Trash 
} from 'lucide-react';
import { FactoryInput, IndustryType, RawMaterialInput, FuelInput, TransportInput, WasteInput, SavedAnalysis } from '../types';
import { useToast } from '../components/Toast';

interface NewAnalysisViewProps {
  onAnalysisComplete: (record: SavedAnalysis) => void;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_INPUT: FactoryInput = {
  factoryName: '',
  industryType: 'Steel',
  location: '',
  productName: '',
  productionQuantity: 1000,
  unit: 'tons',
  operatingDaysPerMonth: 22,
  renewableEnergyPercent: 15,
  recycledMaterialPercent: 10,
  electricityValue: 12500,
  electricityUnit: 'kWh',
  rawMaterials: [{ id: 'rm_1', name: 'Raw Iron Ore', quantity: 250, unit: 'tons' }],
  fuels: [{ id: 'f_1', type: 'Coal', amount: 80, unit: 'tons' }],
  transports: [{ id: 't_1', vehicleType: 'Truck', distance: 1200, unit: 'km' }],
  wastes: [{ id: 'w_1', type: 'Metal', quantity: 15, unit: 'tons' }],
};

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({ onAnalysisComplete, setLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FactoryInput>({ ...DEFAULT_INPUT });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['productionQuantity', 'operatingDaysPerMonth', 'renewableEnergyPercent', 'recycledMaterialPercent', 'electricityValue'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // Raw Materials Handlers
  const addRawMaterial = () => {
    const id = 'rm_' + Math.random().toString(36).substring(2, 9);
    setFormData((prev) => ({
      ...prev,
      rawMaterials: [...prev.rawMaterials, { id, name: '', quantity: 0, unit: 'tons' }],
    }));
  };

  const removeRawMaterial = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((m) => m.id !== id),
    }));
  };

  const handleRawMaterialChange = (id: string, field: keyof RawMaterialInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((m) => 
        m.id === id ? { ...m, [field]: field === 'quantity' ? Number(value) : value } : m
      ),
    }));
  };

  // Fuels Handlers
  const addFuel = () => {
    const id = 'f_' + Math.random().toString(36).substring(2, 9);
    setFormData((prev) => ({
      ...prev,
      fuels: [...prev.fuels, { id, type: 'Diesel', amount: 0, unit: 'liters' }],
    }));
  };

  const removeFuel = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fuels: prev.fuels.filter((f) => f.id !== id),
    }));
  };

  const handleFuelChange = (id: string, field: keyof FuelInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      fuels: prev.fuels.map((f) => 
        f.id === id ? { ...f, [field]: field === 'amount' ? Number(value) : value } : f
      ),
    }));
  };

  // Transports Handlers
  const addTransport = () => {
    const id = 't_' + Math.random().toString(36).substring(2, 9);
    setFormData((prev) => ({
      ...prev,
      transports: [...prev.transports, { id, vehicleType: 'Truck', distance: 0, unit: 'km' }],
    }));
  };

  const removeTransport = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      transports: prev.transports.filter((t) => t.id !== id),
    }));
  };

  const handleTransportChange = (id: string, field: keyof TransportInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      transports: prev.transports.map((t) => 
        t.id === id ? { ...t, [field]: field === 'distance' ? Number(value) : value } : t
      ),
    }));
  };

  // Wastes Handlers
  const addWaste = () => {
    const id = 'w_' + Math.random().toString(36).substring(2, 9);
    setFormData((prev) => ({
      ...prev,
      wastes: [...prev.wastes, { id, type: 'General', quantity: 0, unit: 'tons' }],
    }));
  };

  const removeWaste = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      wastes: prev.wastes.filter((w) => w.id !== id),
    }));
  };

  const handleWasteChange = (id: string, field: keyof WasteInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      wastes: prev.wastes.map((w) => 
        w.id === id ? { ...w, [field]: field === 'quantity' ? Number(value) : value } : w
      ),
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.factoryName.trim()) {
        toast('warning', 'Validation Error', 'Factory Name is required.');
        return false;
      }
      if (!formData.location.trim()) {
        toast('warning', 'Validation Error', 'Factory Location is required.');
        return false;
      }
      if (!formData.productName.trim()) {
        toast('warning', 'Validation Error', 'Main Product Name is required.');
        return false;
      }
      if (formData.productionQuantity <= 0) {
        toast('warning', 'Validation Error', 'Production Quantity must be greater than zero.');
        return false;
      }
    } else if (step === 2) {
      if (formData.electricityValue < 0) {
        toast('warning', 'Validation Error', 'Electricity value cannot be negative.');
        return false;
      }
      for (const m of formData.rawMaterials) {
        if (!m.name.trim() || m.quantity <= 0) {
          toast('warning', 'Validation Error', 'Please complete all raw material lines or delete empty ones.');
          return false;
        }
      }
    } else if (step === 3) {
      for (const f of formData.fuels) {
        if (f.amount <= 0) {
          toast('warning', 'Validation Error', 'Fuel amounts must be positive values.');
          return false;
        }
      }
      for (const t of formData.transports) {
        if (t.distance <= 0) {
          toast('warning', 'Validation Error', 'Transport distances must be greater than zero.');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error during analysis');
      }

      const record = await response.json() as SavedAnalysis;
      toast('success', 'Analysis Completed!', `Successfully evaluated footprint for ${formData.factoryName}.`);
      onAnalysisComplete(record);
    } catch (error: any) {
      console.error(error);
      toast('error', 'Analysis Failed', error.message || 'Gemini API was unable to evaluate this profile. Check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, text: 'Factory Profile' },
    { num: 2, text: 'Energy & Materials' },
    { num: 3, text: 'Fuels, Logistics & Waste' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Wizard Step Indicators */}
      <div className="glass-card rounded-3xl p-6 shadow-sm flex items-center justify-between">
        {stepLabels.map((s) => (
          <div key={s.num} className="flex items-center gap-3 shrink-0">
            <div className={`w-8 h-8 rounded-full font-mono text-sm font-bold flex items-center justify-center transition-all ${
              step === s.num 
                ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/10' 
                : step > s.num 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
              {s.num}
            </div>
            <span className={`text-xs sm:text-sm font-semibold hidden md:inline font-display ${
              step === s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'
            }`}>
              {s.text}
            </span>
            {s.num < 3 && <div className="h-0.5 w-12 bg-gray-200 dark:bg-slate-800 hidden md:block" />}
          </div>
        ))}
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 shadow-xl space-y-8">
        
        {/* STEP 1: Factory Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" /> Factory Profile & General Metrics
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                Enter name, industry type, product coordinates, and baseline operational capacities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Factory Name *</label>
                <input
                  type="text"
                  name="factoryName"
                  value={formData.factoryName}
                  onChange={handleInputChange}
                  placeholder="e.g. Apex Foundry & Sheet Metal"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Industry Sector *</label>
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {['Steel', 'Textile', 'Food', 'Chemical', 'Automobile', 'Electronics', 'Plastic', 'Paper', 'Cement', 'Others'].map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Factory Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Ohio River Valley, USA"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Main Product Manufactured *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g. Structural Steel Beams"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Monthly Production Quantity *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="productionQuantity"
                    value={formData.productionQuantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-32 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-2 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors shrink-0"
                  >
                    {['kg', 'tons', 'pieces', 'liters'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Operating Days per Month *</label>
                <input
                  type="number"
                  name="operatingDaysPerMonth"
                  value={formData.operatingDaysPerMonth}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: Energy & Raw Materials */}
        {step === 2 && (
          <div className="space-y-8">
            
            {/* Energy section */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Utility Power & Recycled Assets
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                  Specify electricity use per month, current renewable usage share, and raw materials recycled quotient.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Monthly Grid Electricity</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="electricityValue"
                      value={formData.electricityValue}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors pr-14"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-mono text-gray-400 pointer-events-none">
                      kWh
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Renewable Energy Used (%)</label>
                  <input
                    type="number"
                    name="renewableEnergyPercent"
                    value={formData.renewableEnergyPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">Recycled Material Input (%)</label>
                  <input
                    type="number"
                    name="recycledMaterialPercent"
                    value={formData.recycledMaterialPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Raw materials dynamic block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
                  Raw Materials Utilized ({formData.rawMaterials.length})
                </span>
                <button
                  type="button"
                  onClick={addRawMaterial}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 px-2 py-1 rounded"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Material
                </button>
              </div>

              {formData.rawMaterials.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                  No materials declared. Footprint results will rely solely on energy profiles.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.rawMaterials.map((m, index) => (
                    <div key={m.id} className="flex gap-3 items-center">
                      <span className="text-xs font-mono text-gray-400 w-5 text-right">{index + 1}.</span>
                      <input
                        type="text"
                        placeholder="Material Name (e.g. Iron Ore, Limestone)"
                        value={m.name}
                        onChange={(e) => handleRawMaterialChange(m.id, 'name', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={m.quantity || ''}
                        onChange={(e) => handleRawMaterialChange(m.id, 'quantity', e.target.value)}
                        className="w-24 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        min="1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. tons)"
                        value={m.unit}
                        onChange={(e) => handleRawMaterialChange(m.id, 'unit', e.target.value)}
                        className="w-20 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeRawMaterial(m.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* STEP 3: Fuels, Logistics & Waste */}
        {step === 3 && (
          <div className="space-y-8">
            
            {/* Fuels section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display flex items-center gap-1.5">
                  <Flame className="w-4.5 h-4.5 text-amber-500" /> Plant direct Fuels Consumption ({formData.fuels.length})
                </h3>
                <button
                  type="button"
                  onClick={addFuel}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Fuel Line
                </button>
              </div>

              {formData.fuels.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                  No direct stationary thermal fuels consumed.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.fuels.map((f, idx) => (
                    <div key={f.id} className="flex gap-3 items-center">
                      <span className="text-xs font-mono text-gray-400 w-5 text-right">{idx + 1}.</span>
                      <select
                        value={f.type}
                        onChange={(e) => handleFuelChange(f.id, 'type', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        {['Diesel', 'Petrol', 'Natural Gas', 'Coal', 'LPG', 'Biomass', 'Other'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Value consumed"
                        value={f.amount || ''}
                        onChange={(e) => handleFuelChange(f.id, 'amount', e.target.value)}
                        className="w-32 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        min="1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. liters, tons)"
                        value={f.unit}
                        onChange={(e) => handleFuelChange(f.id, 'unit', e.target.value)}
                        className="w-24 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeFuel(f.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transport Logistics section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display flex items-center gap-1.5">
                  <Truck className="w-4.5 h-4.5 text-blue-500" /> Distribution & Freight Logs ({formData.transports.length})
                </h3>
                <button
                  type="button"
                  onClick={addTransport}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Distribution Row
                </button>
              </div>

              {formData.transports.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                  No logistics transport records listed.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.transports.map((t, idx) => (
                    <div key={t.id} className="flex gap-3 items-center">
                      <span className="text-xs font-mono text-gray-400 w-5 text-right">{idx + 1}.</span>
                      <select
                        value={t.vehicleType}
                        onChange={(e) => handleTransportChange(t.id, 'vehicleType', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        {['Truck', 'Train', 'Ship', 'Air', 'Electric Vehicle'].map((vt) => (
                          <option key={vt} value={vt}>{vt}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Est. Distance"
                        value={t.distance || ''}
                        onChange={(e) => handleTransportChange(t.id, 'distance', e.target.value)}
                        className="w-32 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        min="1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. km)"
                        value={t.unit}
                        onChange={(e) => handleTransportChange(t.id, 'unit', e.target.value)}
                        className="w-24 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeTransport(t.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Waste output section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display flex items-center gap-1.5">
                  <Trash className="w-4.5 h-4.5 text-indigo-500" /> Waste Generated ({formData.wastes.length})
                </h3>
                <button
                  type="button"
                  onClick={addWaste}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Waste Type
                </button>
              </div>

              {formData.wastes.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                  No solid/hazardous waste logged.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.wastes.map((w, idx) => (
                    <div key={w.id} className="flex gap-3 items-center">
                      <span className="text-xs font-mono text-gray-400 w-5 text-right">{idx + 1}.</span>
                      <select
                        value={w.type}
                        onChange={(e) => handleWasteChange(w.id, 'type', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        {['Hazardous', 'Plastic', 'Organic', 'Metal', 'Chemical', 'General'].map((wt) => (
                          <option key={wt} value={wt}>{wt}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={w.quantity || ''}
                        onChange={(e) => handleWasteChange(w.id, 'quantity', e.target.value)}
                        className="w-32 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        min="1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. tons)"
                        value={w.unit}
                        onChange={(e) => handleWasteChange(w.id, 'unit', e.target.value)}
                        className="w-24 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeWaste(w.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4.5 h-4.5" /> Analyze Carbon Footprint
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
