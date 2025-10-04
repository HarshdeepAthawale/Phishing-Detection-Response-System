import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://phishing-detection-api.onrender.com/api'
  : 'http://localhost:10000/api';

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    // First, try to connect to the backend API
    const response = await axios.post(`${API_BASE_URL}/detect`, {
      url: url
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Analysis failed');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Analysis timed out. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // If backend is not available, provide a basic client-side analysis
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.warn('Backend API not available, using client-side analysis');
        return performClientSideAnalysis(url);
      }
    }
    
    throw new Error('Failed to analyze URL. Please check your connection and try again.');
  }
};

// Basic client-side analysis as fallback
const performClientSideAnalysis = (url: string): AnalysisResult => {
  const analysis: AnalysisResult = {
    url: url,
    isPhishing: false,
    riskScore: 0,
    riskLevel: 'LOW',
    details: {
      clientSideAnalysis: true,
      urlAnalysis: {
        score: 0,
        issues: [],
        details: {
          length: url.length,
          hasHTTPS: url.startsWith('https://'),
          hasIP: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url)
        }
      }
    },
    recommendations: []
  };

  // Basic URL structure analysis
  if (!url.startsWith('https://')) {
    analysis.riskScore += 15;
    analysis.details.urlAnalysis!.issues.push('Uses HTTP instead of HTTPS');
  }

  // Check for suspicious patterns
  if (url.includes('@') || url.includes('\\')) {
    analysis.riskScore += 15;
    analysis.details.urlAnalysis!.issues.push('Contains suspicious characters');
  }

  // Check URL length
  if (url.length > 100) {
    analysis.riskScore += 5;
    analysis.details.urlAnalysis!.issues.push('Unusually long URL');
  }

  // Determine risk level
  if (analysis.riskScore >= 20) {
    analysis.riskLevel = 'MEDIUM';
  }
  if (analysis.riskScore >= 40) {
    analysis.riskLevel = 'HIGH';
    analysis.isPhishing = true;
  }

  // Generate recommendations
  if (analysis.isPhishing) {
    analysis.recommendations.push('🚨 HIGH RISK: Do not enter any personal information');
    analysis.recommendations.push('❌ Do not click on any links in this website');
  } else if (analysis.riskScore > 10) {
    analysis.recommendations.push('⚠️ Some suspicious patterns detected - proceed with caution');
  } else {
    analysis.recommendations.push('✅ URL appears to be legitimate');
  }

  analysis.recommendations.push('ℹ️ Note: This is a basic analysis. For detailed analysis, the backend service needs to be available.');

  return analysis;
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'OK';
  } catch {
    return false;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`, {
      timeout: 10000
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch analytics');
  }
};
