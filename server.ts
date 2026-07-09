import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { analyzeCarbonFootprint } from './server/gemini';
import { AnalysisDatabase } from './server/db';
import { FactoryInput, SavedAnalysis } from './src/types';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Route: Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: Run Carbon Footprint Analysis via Gemini
  app.post('/api/analyze', async (req, res) => {
    try {
      const input = req.body as FactoryInput;
      if (!input || !input.factoryName) {
        return res.status(400).json({ error: 'Missing factory details or input data' });
      }

      console.log(`Starting footprint analysis for: ${input.factoryName}`);
      
      // Contact Gemini API
      const result = await analyzeCarbonFootprint(input);
      
      // Save analysis record to our file-based database
      const id = 'analysis_' + Math.random().toString(36).substring(2, 11);
      const savedRecord: SavedAnalysis = {
        id,
        createdAt: new Date().toISOString(),
        input,
        result,
      };

      AnalysisDatabase.saveAnalysis(savedRecord);
      
      console.log(`Successfully completed and saved analysis for ${input.factoryName}`);
      return res.status(200).json(savedRecord);
    } catch (error: any) {
      console.error('API Error during analysis:', error);
      return res.status(500).json({ 
        error: 'Failed to analyze carbon footprint', 
        details: error.message || error 
      });
    }
  });

  // API Route: Retrieve analysis history
  app.get('/api/history', (req, res) => {
    try {
      const history = AnalysisDatabase.getAnalyses();
      // Sort with newest first
      const sortedHistory = [...history].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json(sortedHistory);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch history', details: error.message });
    }
  });

  // API Route: Retrieve a single analysis by ID
  app.get('/api/history/:id', (req, res) => {
    try {
      const analysis = AnalysisDatabase.getAnalysisById(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch analysis', details: error.message });
    }
  });

  // API Route: Delete analysis record
  app.delete('/api/history/:id', (req, res) => {
    try {
      const deleted = AnalysisDatabase.deleteAnalysis(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Analysis record not found' });
      }
      res.json({ success: true, message: 'Analysis deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete analysis', details: error.message });
    }
  });

  // Integrate Vite Dev Server middleware in non-production, otherwise serve static dist
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running in DEVELOPMENT mode. Mounting Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running in PRODUCTION mode. Serving static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
