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

// Enhanced client-side analysis with better phishing detection
const performClientSideAnalysis = (url: string): AnalysisResult => {
  console.log('🔄 Performing enhanced client-side analysis for:', url);
  
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
          hasIP: false
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

  let hostname = '';
  let domain = '';

  // Parse URL and extract hostname
  try {
    const urlObj = new URL(url);
    hostname = urlObj.hostname.toLowerCase();
    domain = hostname.includes('.') ? hostname.split('.').slice(-2).join('.') : hostname;
  } catch (e) {
    analysis.riskScore += 30;
    analysis.details!.urlAnalysis!.issues.push('Invalid URL format');
    analysis.riskLevel = 'HIGH';
    analysis.isPhishing = true;
    analysis.recommendations.push('🚨 INVALID URL: This is not a valid web address');
    return analysis;
  }

  // Trusted domains list
  const trustedDomains = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'github.com', 'stackoverflow.com', 'amazon.com', 'paypal.com',
    'apple.com', 'microsoft.com', 'netflix.com', 'spotify.com', 'reddit.com',
    'wikipedia.org', 'medium.com', 'dropbox.com', 'adobe.com', 'salesforce.com',
    'zoom.us', 'slack.com', 'discord.com', 'twitch.tv', 'ebay.com'
  ];

  // Check if domain is trusted
  const isTrusted = trustedDomains.includes(domain) || trustedDomains.some(trusted => 
    domain.endsWith('.' + trusted) || hostname === trusted
  );
  analysis.details!.domainAnalysis!.details.isTrusted = isTrusted;

  // 1. HTTP vs HTTPS (15 points)
  if (!url.startsWith('https://') && !hostname.includes('localhost')) {
    analysis.riskScore += 15;
    analysis.details!.urlAnalysis!.issues.push('Uses HTTP instead of HTTPS');
    analysis.details!.sslAnalysis!.score += 20;
    analysis.details!.sslAnalysis!.issues.push('No SSL certificate');
  }

  // 2. IP address instead of domain (25 points)
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(hostname)) {
    analysis.riskScore += 25;
    analysis.details!.urlAnalysis!.issues.push('Uses IP address instead of domain name');
    analysis.details!.domainAnalysis!.issues.push('Domain is an IP address');
    analysis.details!.urlAnalysis!.details.hasIP = true;
  }

  // 3. Suspicious characters (20 points)
  if (url.includes('@') || url.includes('\\') || url.includes('%')) {
    analysis.riskScore += 20;
    analysis.details!.urlAnalysis!.issues.push('Contains suspicious characters (@, \, %)');
  }

  // 4. URL length (5 points)
  if (url.length > 100) {
    analysis.riskScore += 5;
    analysis.details!.urlAnalysis!.issues.push('Unusually long URL');
  }

  // 5. Typosquatting detection (30 points)
  const typosquattingPatterns = [
    { original: 'google', variations: ['googIe', 'g00gle', 'googIe', 'googIe'] },
    { original: 'facebook', variations: ['faceb00k', 'facebo0k', 'fac3book'] },
    { original: 'amazon', variations: ['amaz0n', 'amazom', 'amaz0n'] },
    { original: 'paypal', variations: ['paypaI', 'paypa1', 'paypaI'] },
    { original: 'apple', variations: ['appIe', 'app1e', 'appIe'] },
    { original: 'microsoft', variations: ['m1crosoft', 'micros0ft', 'microsoft'] },
    { original: 'youtube', variations: ['y0utube', 'youtub3', 'y0utube'] },
    { original: 'twitter', variations: ['tw1tter', 'twitt3r', 'tw1tter'] },
    { original: 'netflix', variations: ['netfIix', 'netfl1x', 'netfIix'] }
  ];

  let hasTyposquatting = false;
  for (const pattern of typosquattingPatterns) {
    if (hostname.includes(pattern.original)) {
      const hasVariation = pattern.variations.some(variation => hostname.includes(variation));
      if (hasVariation) {
        hasTyposquatting = true;
        break;
      }
    }
  }

  if (hasTyposquatting) {
    analysis.riskScore += 30;
    analysis.details!.domainAnalysis!.issues.push('Possible typosquatting detected');
  }

  // 6. Suspicious subdomains (15 points)
  const suspiciousSubdomains = [
    'login-', 'secure-', 'verify-', 'account-', 'update-', 'confirm-',
    'validate-', 'authenticate-', 'bank-', 'paypal-', 'amazon-', 'apple-'
  ];
  
  const hasSuspiciousSubdomain = suspiciousSubdomains.some(sub => hostname.includes(sub));
  if (hasSuspiciousSubdomain) {
    analysis.riskScore += 15;
    analysis.details!.domainAnalysis!.issues.push('Suspicious subdomain pattern');
  }

  // 7. Shortened URLs (10 points)
  const shortenerDomains = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co'];
  if (shortenerDomains.some(shortener => hostname.includes(shortener))) {
    analysis.riskScore += 10;
    analysis.details!.domainAnalysis!.issues.push('Uses URL shortener service');
  }

  // 8. Suspicious TLDs (10 points)
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.ru', '.cn'];
  if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
    analysis.riskScore += 10;
    analysis.details!.domainAnalysis!.issues.push('Uses suspicious top-level domain');
  }

  // 9. Multiple hyphens (5 points)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount > 3) {
    analysis.riskScore += 5;
    analysis.details!.domainAnalysis!.issues.push('Too many hyphens in domain');
  }

  // 10. Non-trusted domain penalty (5 points)
  if (!isTrusted && analysis.riskScore < 20) {
    analysis.riskScore += 5;
    analysis.details!.domainAnalysis!.issues.push('Domain not in trusted list');
  }

  // Determine risk level
  if (analysis.riskScore >= 60) {
    analysis.riskLevel = 'HIGH';
    analysis.isPhishing = true;
  } else if (analysis.riskScore >= 35) {
    analysis.riskLevel = 'MEDIUM';
  } else if (analysis.riskScore >= 15) {
    analysis.riskLevel = 'LOW-MEDIUM';
  }

  // Generate recommendations
  if (analysis.isPhishing) {
    analysis.recommendations.push('🚨 HIGH RISK: This appears to be a phishing site');
    analysis.recommendations.push('❌ Do not enter any personal information');
    analysis.recommendations.push('🔒 Report this site to your security team');
    analysis.recommendations.push('🚫 Do not click on any links in this website');
  } else if (analysis.riskScore >= 35) {
    analysis.recommendations.push('⚠️ MEDIUM RISK: Multiple suspicious patterns detected');
    analysis.recommendations.push('🔍 Verify this is the official website');
    analysis.recommendations.push('📱 Use official mobile apps if available');
    analysis.recommendations.push('🔐 Ensure you\'re using HTTPS');
  } else if (analysis.riskScore >= 15) {
    analysis.recommendations.push('⚠️ Some suspicious patterns detected - proceed with caution');
    analysis.recommendations.push('🔍 Double-check the website URL');
  } else {
    analysis.recommendations.push('✅ URL appears to be legitimate');
    if (isTrusted) {
      analysis.recommendations.push('✅ Domain is in trusted list');
    }
  }

  // Add SSL recommendations
  if (!url.startsWith('https://') && !hostname.includes('localhost')) {
    analysis.recommendations.push('🔓 Website does not use SSL encryption');
  }

  analysis.recommendations.push('ℹ️ Client-side analysis: For comprehensive security analysis, deploy the backend service.');

  console.log('✅ Enhanced client-side analysis completed:', {
    url: url,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    isPhishing: analysis.isPhishing,
    issues: [
      ...analysis.details!.urlAnalysis!.issues,
      ...analysis.details!.domainAnalysis!.issues,
      ...analysis.details!.sslAnalysis!.issues
    ]
  });

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
