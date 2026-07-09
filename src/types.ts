export type IndustryType =
  | 'Steel'
  | 'Textile'
  | 'Food'
  | 'Chemical'
  | 'Automobile'
  | 'Electronics'
  | 'Plastic'
  | 'Paper'
  | 'Cement'
  | 'Others';

export interface RawMaterialInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface FuelInput {
  id: string;
  type: 'Diesel' | 'Petrol' | 'Natural Gas' | 'Coal' | 'LPG' | 'Biomass' | 'Other';
  amount: number;
  unit: string;
}

export interface TransportInput {
  id: string;
  vehicleType: 'Truck' | 'Train' | 'Ship' | 'Air' | 'Electric Vehicle';
  distance: number;
  unit: string;
}

export interface WasteInput {
  id: string;
  type: 'Hazardous' | 'Plastic' | 'Organic' | 'Metal' | 'Chemical' | 'General';
  quantity: number;
  unit: string;
}

export interface FactoryInput {
  factoryName: string;
  industryType: IndustryType;
  location: string;
  productName: string;
  productionQuantity: number;
  unit: 'kg' | 'tons' | 'pieces' | 'liters';
  operatingDaysPerMonth: number;
  renewableEnergyPercent: number; // 0-100
  recycledMaterialPercent: number; // 0-100
  electricityValue: number;
  electricityUnit: 'kWh';
  rawMaterials: RawMaterialInput[];
  fuels: FuelInput[];
  transports: TransportInput[];
  wastes: WasteInput[];
}

export type CarbonScoreType = 'Green' | 'Yellow' | 'Red';
export type RiskLevelType = 'Low' | 'Medium' | 'High';

export interface EmissionBreakdown {
  electricity: number; // in tons of CO2
  fuel: number;
  transport: number;
  rawMaterials: number;
  waste: number;
}

export interface Recommendation {
  id: string;
  category: 'Energy Optimization' | 'Waste Reduction' | 'Transportation Optimization' | 'Raw Materials' | 'General';
  title: string;
  description: string;
  costSavingsOpportunity: string;
  impactLevel: 'Low' | 'Medium' | 'High';
}

export interface PredictionPoint {
  year: number;
  baseline: number;
  projected: number;
}

export interface FactoryBenchmark {
  factoryIntensity: number; // kg CO2 per unit product
  industryAverageIntensity: number; // kg CO2 per unit product
  percentile: number; // e.g., 65 (better than 65% of the industry)
  industryBenchmarkText: string;
}

export interface GeminiAnalysisResult {
  estimatedCO2: number; // Total annual CO2 emissions in tons
  carbonScore: CarbonScoreType;
  environmentalRisk: RiskLevelType;
  environmentalRiskExplanation: string;
  executiveSummary: string;
  detailedCarbonAnalysis: string;
  emissionBreakdown: EmissionBreakdown;
  mostPollutingActivity: string;
  recommendations: Recommendation[];
  governmentSuggestions: string[];
  futureReductionPrediction: PredictionPoint[];
  confidenceScore: number; // 0-100
  factoryBenchmark: FactoryBenchmark;
}

export interface SavedAnalysis {
  id: string;
  createdAt: string;
  input: FactoryInput;
  result: GeminiAnalysisResult;
}
