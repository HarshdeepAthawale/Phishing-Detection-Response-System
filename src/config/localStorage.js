const fs = require('fs').promises;
const path = require('path');

// Local storage directory - use /tmp for deployment environments
const STORAGE_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/data' 
  : path.join(__dirname, '../../data');
const ANALYSES_FILE = path.join(STORAGE_DIR, 'analyses.json');

// Initialize local storage
const initStorage = async () => {
  try {
    // Create storage directory if it doesn't exist
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    
    // Create analyses.json if it doesn't exist
    try {
      await fs.access(ANALYSES_FILE);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(ANALYSES_FILE, JSON.stringify([], null, 2));
      console.log('✅ Local storage initialized');
    }
    
    console.log(`✅ Local storage directory: ${STORAGE_DIR}`);
  } catch (error) {
    console.error('❌ Local storage initialization error:', error.message);
    throw error;
  }
};

// Save analysis result to local file
const saveAnalysis = async (analysisData) => {
  try {
    const data = await fs.readFile(ANALYSES_FILE, 'utf8');
    const analyses = JSON.parse(data);
    
    analyses.push({
      ...analysisData,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    });
    
    await fs.writeFile(ANALYSES_FILE, JSON.stringify(analyses, null, 2));
    return analyses[analyses.length - 1];
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
};

// Get all analyses
const getAllAnalyses = async () => {
  try {
    const data = await fs.readFile(ANALYSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analyses:', error);
    return [];
  }
};

// Get analytics data
const getAnalytics = async () => {
  try {
    const analyses = await getAllAnalyses();
    
    const totalAnalyses = analyses.length;
    const phishingCount = analyses.filter(a => a.isPhishing).length;
    const recentAnalyses = analyses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(({ url, isPhishing, riskScore, createdAt }) => ({
        url, isPhishing, riskScore, createdAt
      }));
    
    // Risk level statistics
    const riskLevelStats = analyses.reduce((acc, analysis) => {
      const level = analysis.riskLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalAnalyses,
      phishingCount,
      phishingPercentage: totalAnalyses > 0 ? ((phishingCount / totalAnalyses) * 100).toFixed(2) : 0,
      recentAnalyses,
      riskLevelStats: Object.entries(riskLevelStats).map(([level, count]) => ({ _id: level, count }))
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

module.exports = {
  initStorage,
  saveAnalysis,
  getAllAnalyses,
  getAnalytics
};
