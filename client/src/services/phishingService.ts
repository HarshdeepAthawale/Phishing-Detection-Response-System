import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://phishing-detection-api.onrender.com/api'
  : 'http://localhost:10000/api';

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  console.log('🔍 Starting URL analysis for:', url);
  console.log('🌐 API Base URL:', API_BASE_URL);
  
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
      console.log('✅ Backend analysis successful');
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Analysis failed');
    }
  } catch (error) {
    console.error('❌ Backend error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.warn('⏰ Request timed out, using client-side analysis');
        return performClientSideAnalysis(url);
      }
      if (error.response?.status === 429) {
        console.warn('🚫 Rate limited, using client-side analysis');
        return performClientSideAnalysis(url);
      }
      if (error.response?.status === 404) {
        console.warn('🔍 Backend not found, using client-side analysis');
        return performClientSideAnalysis(url);
      }
      if (error.response?.data?.message) {
        console.warn('⚠️ Backend error:', error.response.data.message, ', using client-side analysis');
        return performClientSideAnalysis(url);
      }
      
      // If backend is not available, provide a basic client-side analysis
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.warn('🌐 Backend API not available, using client-side analysis');
        return performClientSideAnalysis(url);
      }
    }
    
    console.warn('🔄 Fallback to client-side analysis');
    return performClientSideAnalysis(url);
  }
};

// Enhanced client-side analysis as fallback
const performClientSideAnalysis = (url: string): AnalysisResult => {
  console.log('🔄 Performing client-side analysis for:', url);
  
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
      },
      domainAnalysis: {
        score: 0,
        issues: [],
        details: {
          isTrusted: false
        }
      },
      sslAnalysis: {
        hasSSL: url.startsWith('https://'),
        score: 0,
        issues: [],
        details: { protocol: url.startsWith('https://') ? 'HTTPS' : 'HTTP' }
      }
    },
    recommendations: []
  };

  // Basic URL structure analysis
  if (!url.startsWith('https://')) {
    analysis.riskScore += 15;
    analysis.details!.urlAnalysis!.issues.push('Uses HTTP instead of HTTPS');
  }

  // Check for suspicious patterns
  if (url.includes('@') || url.includes('\\')) {
    analysis.riskScore += 15;
    analysis.details!.urlAnalysis!.issues.push('Contains suspicious characters');
  }

  // Check URL length
  if (url.length > 100) {
    analysis.riskScore += 5;
    analysis.details!.urlAnalysis!.issues.push('Unusually long URL');
  }

  // Check for IP address instead of domain
  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  try {
    const hostname = new URL(url).hostname;
    if (ipRegex.test(hostname)) {
      analysis.riskScore += 20;
      analysis.details!.urlAnalysis!.issues.push('Uses IP address instead of domain name');
      analysis.details!.domainAnalysis!.issues.push('Domain is an IP address');
    }
  } catch (e) {
    // Invalid URL
    analysis.riskScore += 25;
    analysis.details!.urlAnalysis!.issues.push('Invalid URL format');
  }

  // Check for common typosquatting patterns
  const hostname = url.toLowerCase();
  const suspiciousPatterns = [
    'googIe', 'faceb00k', 'amaz0n', 'paypaI', 'appIe', 'tw1tter', 'netfIix', 'm1crosoft', 'y0utube'
  ];
  
  const hasTyposquatting = suspiciousPatterns.some(pattern => hostname.includes(pattern));
  if (hasTyposquatting) {
    analysis.riskScore += 20;
    analysis.details!.domainAnalysis!.issues.push('Possible typosquatting detected');
  }

  // Check for suspicious subdomains
  if (hostname.includes('login-') || hostname.includes('secure-') || hostname.includes('verify-')) {
    analysis.riskScore += 10;
    analysis.details!.domainAnalysis!.issues.push('Suspicious subdomain pattern');
  }

  // SSL Analysis
  if (!url.startsWith('https://')) {
    analysis.details!.sslAnalysis!.score += 20;
    analysis.details!.sslAnalysis!.issues.push('No SSL certificate (HTTP instead of HTTPS)');
    analysis.riskScore += 20;
  }

  // Determine risk level
  if (analysis.riskScore >= 50) {
    analysis.riskLevel = 'HIGH';
    analysis.isPhishing = true;
  } else if (analysis.riskScore >= 25) {
    analysis.riskLevel = 'MEDIUM';
  } else if (analysis.riskScore >= 10) {
    analysis.riskLevel = 'LOW-MEDIUM';
  }

  // Generate recommendations
  if (analysis.isPhishing) {
    analysis.recommendations.push('🚨 HIGH RISK: Do not enter any personal information');
    analysis.recommendations.push('❌ Do not click on any links in this website');
    analysis.recommendations.push('🔒 Report this site to your security team');
  } else if (analysis.riskScore >= 25) {
    analysis.recommendations.push('⚠️ MEDIUM RISK: Suspicious patterns detected');
    analysis.recommendations.push('🔍 Verify this is the official website');
    analysis.recommendations.push('📱 Use official mobile apps if available');
  } else if (analysis.riskScore >= 10) {
    analysis.recommendations.push('⚠️ Some suspicious patterns detected - proceed with caution');
  } else {
    analysis.recommendations.push('✅ URL appears to be legitimate');
  }

  // Add SSL recommendations
  if (!url.startsWith('https://') && !url.includes('localhost')) {
    analysis.recommendations.push('🔓 Website does not use SSL encryption');
  }

  analysis.recommendations.push('ℹ️ Client-side analysis: For comprehensive security analysis, please ensure the backend service is deployed and accessible.');

  console.log('✅ Client-side analysis completed:', analysis);
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
