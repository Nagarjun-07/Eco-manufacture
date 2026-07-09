import fs from 'fs';
import path from 'path';
import { SavedAnalysis } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'analyses.json');

// Ensure database directory and file exist
function initializeDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export class AnalysisDatabase {
  static getAnalyses(): SavedAnalysis[] {
    try {
      initializeDb();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content) as SavedAnalysis[];
    } catch (error) {
      console.error('Error reading database:', error);
      return [];
    }
  }

  static saveAnalysis(analysis: SavedAnalysis): SavedAnalysis {
    try {
      initializeDb();
      const analyses = this.getAnalyses();
      // Avoid duplicate IDs
      const index = analyses.findIndex((a) => a.id === analysis.id);
      if (index >= 0) {
        analyses[index] = analysis;
      } else {
        analyses.push(analysis);
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(analyses, null, 2), 'utf-8');
      return analysis;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  }

  static deleteAnalysis(id: string): boolean {
    try {
      initializeDb();
      const analyses = this.getAnalyses();
      const filtered = analyses.filter((a) => a.id !== id);
      if (filtered.length === analyses.length) {
        return false;
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error deleting from database:', error);
      throw error;
    }
  }

  static getAnalysisById(id: string): SavedAnalysis | undefined {
    const analyses = this.getAnalyses();
    return analyses.find((a) => a.id === id);
  }
}
