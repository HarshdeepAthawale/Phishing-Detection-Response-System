import axios from 'axios';
import { AnalysisResult } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    // Try backend API first
    const response = await axios.post(`${API_BASE_URL}/detect`, { url });
    return response.data;
  } catch (error) {
    console.warn('Backend API unavailable, using fallback analysis');
    // Fallback to client-side analysis
    return await performClientSideAnalysis(url);
  }
};

const performClientSideAnalysis = async (url: string): Promise<AnalysisResult> => {
  // Basic URL validation
  let score = 0;
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (urlObj.protocol !== 'https:') {
      score += 20;
      issues.push('URL uses HTTP instead of HTTPS');
      recommendations.push('Use HTTPS for secure connections');
    }
    
    // Check for suspicious patterns
    if (url.includes('@')) {
      score += 30;
      issues.push('URL contains suspicious @ symbol');
      recommendations.push('Avoid URLs with @ symbols');
    }
    
    if (url.length > 100) {
      score += 10;
      issues.push('URL is unusually long');
      recommendations.push('Be cautious with very long URLs');
    }
    
    // Check for common phishing patterns
    const suspiciousPatterns = ['login', 'account', 'secure', 'verify', 'update'];
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
      url.toLowerCase().includes(pattern)
    );
    
    if (hasSuspiciousPattern) {
      score += 15;
      issues.push('URL contains common phishing keywords');
      recommendations.push('Be extra cautious with URLs containing login/account keywords');
    }
    
    // Basic domain analysis
    const domain = urlObj.hostname;
    if (domain.includes('-')) {
      score += 5;
      issues.push('Domain contains hyphens (potential typosquatting)');
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (score < 20) riskLevel = 'low';
    else if (score < 50) riskLevel = 'medium';
    else riskLevel = 'high';
    
    return {
      url,
      riskScore: score,
      riskLevel,
      isThreat: score > 50,
      confidence: score > 70 ? 'high' : score > 30 ? 'medium' : 'low',
      analysis: {
        urlStructure: {
          isValid: true,
          protocol: urlObj.protocol,
          domain: domain,
          path: urlObj.pathname,
          issues: issues.filter(issue => issue.includes('HTTP') || issue.includes('@') || issue.includes('long'))
        },
        domainReputation: {
          isTrusted: false,
          age: 'unknown',
          registrar: 'unknown',
          issues: issues.filter(issue => issue.includes('domain') || issue.includes('hyphens'))
        },
        contentAnalysis: {
          isAccessible: false,
          hasSuspiciousContent: false,
          issues: issues.filter(issue => issue.includes('phishing'))
        },
        sslAnalysis: {
          hasValidCertificate: urlObj.protocol === 'https:',
          certificateIssuer: 'unknown',
          issues: issues.filter(issue => issue.includes('HTTPS'))
        },
        virusTotal: {
          isMalicious: false,
          detectionCount: 0,
          lastAnalysis: new Date().toISOString(),
          issues: []
        }
      },
      timestamp: new Date().toISOString(),
      source: 'client-side-fallback',
      issues,
      recommendations
    };
    
  } catch (error) {
    // Invalid URL
    return {
      url,
      riskScore: 100,
      riskLevel: 'high',
      isThreat: true,
      confidence: 'high',
      analysis: {
        urlStructure: {
          isValid: false,
          protocol: 'unknown',
          domain: 'invalid',
          path: 'invalid',
          issues: ['Invalid URL format']
        },
        domainReputation: {
          isTrusted: false,
          age: 'unknown',
          registrar: 'unknown',
          issues: ['Invalid URL - cannot analyze domain']
        },
        contentAnalysis: {
          isAccessible: false,
          hasSuspiciousContent: false,
          issues: ['Invalid URL - cannot analyze content']
        },
        sslAnalysis: {
          hasValidCertificate: false,
          certificateIssuer: 'unknown',
          issues: ['Invalid URL - cannot analyze SSL']
        },
        virusTotal: {
          isMalicious: false,
          detectionCount: 0,
          lastAnalysis: new Date().toISOString(),
          issues: ['Invalid URL - cannot check with VirusTotal']
        }
      },
      timestamp: new Date().toISOString(),
      source: 'client-side-fallback',
      issues: ['Invalid URL format'],
      recommendations: ['Please enter a valid URL']
    };
  }
};
