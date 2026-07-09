import { GoogleGenAI, Type } from '@google/genai';
import { FactoryInput, GeminiAnalysisResult } from '../src/types';

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in your environment/secrets panel.');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function analyzeCarbonFootprint(input: FactoryInput): Promise<GeminiAnalysisResult> {
  const ai = getGeminiClient();

  const prompt = `
Analyze the carbon footprint and sustainability metrics of the following manufacturing facility as an expert environmental sustainability consultant. 
Perform realistic, data-driven reasoning based on industry-standard emission factors, the specific location, industry type, electricity usage, raw materials, fuels consumed, transport logs, and waste output. Do NOT just use static formulas; reason intelligently about the factory's operational context.

Here is the factory data:
- Factory Name: ${input.factoryName}
- Industry Type: ${input.industryType}
- Location: ${input.location}
- Main Product: ${input.productName}
- Production Volume: ${input.productionQuantity} ${input.unit} per month (operating ${input.operatingDaysPerMonth} days/month)
- Renewable Energy Usage: ${input.renewableEnergyPercent}% of total electricity
- Recycled Materials Usage: ${input.recycledMaterialPercent}% of raw materials
- Electricity Consumption: ${input.electricityValue} ${input.electricityUnit} per month
- Raw Materials:
${input.rawMaterials.map((m) => `  * ${m.name}: ${m.quantity} ${m.unit}`).join('\n')}
- Fuels:
${input.fuels.map((f) => `  * ${f.type}: ${f.amount} ${f.unit}`).join('\n')}
- Transportation:
${input.transports.map((t) => `  * Vehicle: ${t.vehicleType}, Distance: ${t.distance} ${t.unit}`).join('\n')}
- Waste Generated:
${input.wastes.map((w) => `  * Type: ${w.type}, Quantity: ${w.quantity} ${w.unit}`).join('\n')}

Based on this data, estimate the annual emissions and generate a complete report.
  `;

  const systemInstruction = `
You are an elite, senior environmental engineer and industrial sustainability consultant with 20+ years of experience.
Your job is to analyze manufacturing data and provide an extremely precise, professional carbon footprint report.
Calculate the estimated annual CO2 emissions in Metric Tons. Make sure your calculations correspond roughly to standard emission factors (e.g., Grid electricity is ~0.4 kg/kWh on average but varies by location, diesel is ~2.68 kg/liter, coal is ~2.4 tons CO2 per ton, etc.).
Determine the Carbon Score (Green if carbon intensity is low, Yellow if moderate, Red if high for this industry category).
Determine the Environmental Risk (Low, Medium, High) with a detailed consultant reasoning explaining why.
Create a compelling Executive Summary (about 3-4 sentences) and a Detailed Carbon Analysis (about 5-6 sentences).
Provide a breakdown of CO2 emissions (in Metric Tons per year) among these 5 categories: electricity, fuel, transport, rawMaterials, waste.
Identify the "Most Polluting Activity" in a brief explanation.
Provide exactly 5 concrete, actionable, highly specific Recommendations. Categorize them appropriately (Energy Optimization, Waste Reduction, Transportation Optimization, Raw Materials, or General). Each recommendation must include:
- A title
- A descriptive action plan
- An estimate of cost savings opportunity (e.g., "$15,000 - $20,000 annual savings" or "15% reduction in fuel expenses")
- An impact level (Low, Medium, High)
Provide 3-4 tailored suggestions for government sustainability grants, regulatory compliance, or tax credit programs applicable to this factory's location or industry.
Provide a future carbon reduction projection (emissions in tons/year) for years 2026, 2027, 2028, 2029, and 2030, showing:
- "baseline": emissions if no changes are made
- "projected": emissions if your recommendations are fully adopted
Calculate a realistic benchmarking score containing:
- factoryIntensity (kg CO2 emitted per unit of product, e.g. estimatedCO2 * 1000 / (productionQuantity * 12))
- industryAverageIntensity (typical intensity for this industry type, e.g. Steel is high, Textiles are medium, Electronics are low-to-medium)
- percentile (what percentage of factories in this industry is this facility performing BETTER than)
- industryBenchmarkText (a constructive consultant feedback paragraph comparing them to competitors)
Include a realistic confidence score (0-100) based on the completeness of data.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedCO2: {
              type: Type.NUMBER,
              description: 'The estimated total annual carbon emissions of the facility in metric tons of CO2.',
            },
            carbonScore: {
              type: Type.STRING,
              description: 'The overall carbon footprint score. Allowed values: Green, Yellow, Red.',
            },
            environmentalRisk: {
              type: Type.STRING,
              description: 'The general environmental risk classification. Allowed values: Low, Medium, High.',
            },
            environmentalRiskExplanation: {
              type: Type.STRING,
              description: 'Detailed explanation of why this risk score was assigned.',
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'High-level professional executive summary of the environmental footprint.',
            },
            detailedCarbonAnalysis: {
              type: Type.STRING,
              description: 'Deep-dive analysis of the carbon emission drivers, patterns, and areas of concern.',
            },
            emissionBreakdown: {
              type: Type.OBJECT,
              properties: {
                electricity: { type: Type.NUMBER, description: 'Annual tons of CO2 from electricity consumption.' },
                fuel: { type: Type.NUMBER, description: 'Annual tons of CO2 from fuel usage.' },
                transport: { type: Type.NUMBER, description: 'Annual tons of CO2 from transportation.' },
                rawMaterials: { type: Type.NUMBER, description: 'Annual tons of CO2 from raw materials extraction/processing.' },
                waste: { type: Type.NUMBER, description: 'Annual tons of CO2 from waste management and landfills.' },
              },
              required: ['electricity', 'fuel', 'transport', 'rawMaterials', 'waste'],
            },
            mostPollutingActivity: {
              type: Type.STRING,
              description: 'A description of the single most carbon-intensive activity in the facility.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  costSavingsOpportunity: { type: Type.STRING },
                  impactLevel: { type: Type.STRING },
                },
                required: ['id', 'category', 'title', 'description', 'costSavingsOpportunity', 'impactLevel'],
              },
              description: 'Exactly 5 actionable sustainability recommendations.',
            },
            governmentSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Government credits, standards, subsidies or reporting frameworks.',
            },
            futureReductionPrediction: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.INTEGER },
                  baseline: { type: Type.NUMBER },
                  projected: { type: Type.NUMBER },
                },
                required: ['year', 'baseline', 'projected'],
              },
              description: 'Annual carbon trajectory prediction from 2026 to 2030.',
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: 'Value from 0 to 100 representing assessment quality.',
            },
            factoryBenchmark: {
              type: Type.OBJECT,
              properties: {
                factoryIntensity: { type: Type.NUMBER },
                industryAverageIntensity: { type: Type.NUMBER },
                percentile: { type: Type.NUMBER },
                industryBenchmarkText: { type: Type.STRING },
              },
              required: ['factoryIntensity', 'industryAverageIntensity', 'percentile', 'industryBenchmarkText'],
            },
          },
          required: [
            'estimatedCO2',
            'carbonScore',
            'environmentalRisk',
            'environmentalRiskExplanation',
            'executiveSummary',
            'detailedCarbonAnalysis',
            'emissionBreakdown',
            'mostPollutingActivity',
            'recommendations',
            'governmentSuggestions',
            'futureReductionPrediction',
            'confidenceScore',
            'factoryBenchmark',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (error) {
    console.error('Error in analyzeCarbonFootprint with Gemini:', error);
    throw error;
  }
}
