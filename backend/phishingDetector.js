const axios = require('axios');
const cheerio = require('cheerio');
const Url = require('url-parse');
const whois = require('whois');
const DomainReputationService = require('./services/domainReputationService');
const VirusTotalService = require('./services/virusTotalService');

class PhishingDetector {
  constructor() {
    this.suspiciousKeywords = [
      'login', 'signin', 'account', 'verify', 'update', 'secure',
      'confirm', 'validate', 'authenticate', 'bank', 'paypal',
      'amazon', 'apple', 'microsoft', 'google', 'facebook'
    ];
    
    // Initialize domain reputation service
    this.domainReputationService = new DomainReputationService();
    
    // Initialize VirusTotal service
    this.virusTotalService = new VirusTotalService();
    
    // Keep fallback trusted domains for backward compatibility
    this.trustedDomains = [
      'google.com', 'amazon.com', 'paypal.com', 'apple.com',
      'microsoft.com', 'facebook.com', 'twitter.com', 'linkedin.com',
      'github.com', 'stackoverflow.com', 'netflix.com', 'spotify.com'
    ];
  }

  async analyzeUrl(url) {
    const analysis = {
      url: url,
      isPhishing: false,
      riskScore: 0,
      riskLevel: 'LOW',
      details: {},
      recommendations: []
    };

    try {
      // Parse URL
      const parsedUrl = new Url(url);
      analysis.details.parsedUrl = {
        hostname: parsedUrl.hostname,
        protocol: parsedUrl.protocol,
        pathname: parsedUrl.pathname
      };

      // Check 1: URL structure analysis
      const urlAnalysis = this.analyzeUrlStructure(url);
      analysis.riskScore += urlAnalysis.score;
      analysis.details.urlAnalysis = urlAnalysis;

      // Check 2: Domain analysis
      const domainAnalysis = await this.analyzeDomain(parsedUrl.hostname);
      analysis.riskScore += domainAnalysis.score;
      analysis.details.domainAnalysis = domainAnalysis;

      // Check 3: Content analysis (if accessible)
      try {
        const contentAnalysis = await this.analyzeContent(url);
        analysis.riskScore += contentAnalysis.score;
        analysis.details.contentAnalysis = contentAnalysis;
      } catch (error) {
        analysis.details.contentAnalysis = {
          accessible: false,
          error: error.message,
          score: 5 // Penalty for inaccessible content
        };
        analysis.riskScore += 5;
      }

      // Check 4: SSL certificate check
      const sslAnalysis = await this.checkSSL(url);
      analysis.riskScore += sslAnalysis.score;
      analysis.details.sslAnalysis = sslAnalysis;

      // Check 5: VirusTotal check
      try {
        const virusTotalAnalysis = await this.checkVirusTotal(url);
        analysis.riskScore += virusTotalAnalysis.score;
        analysis.details.virusTotalAnalysis = virusTotalAnalysis;
      } catch (virusTotalError) {
        console.warn('VirusTotal check skipped:', virusTotalError.message);
        analysis.details.virusTotalAnalysis = {
          isThreat: false,
          score: 0,
          issues: [],
          details: {
            error: 'Service unavailable',
            confidence: 'unknown',
            positives: 0,
            total: 0,
            engines: {}
          },
          threatTypes: [],
          confidence: 'unknown',
          source: 'VirusTotal (Unavailable)'
        };
      }

      // Determine final risk level and phishing status
      analysis.riskLevel = this.determineRiskLevel(analysis.riskScore);
      analysis.isPhishing = analysis.riskScore >= 50;

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      return analysis;

    } catch (error) {
      console.error('Analysis error:', error);
      analysis.details.error = error.message;
      analysis.riskScore = 100; // High risk if analysis fails
      analysis.riskLevel = 'HIGH';
      analysis.isPhishing = true;
      analysis.recommendations.push('Unable to analyze URL - treat with extreme caution');
      return analysis;
    }
  }

  analyzeUrlStructure(url) {
    const analysis = {
      score: 0,
      issues: [],
      details: {}
    };

    // Check for suspicious patterns
    if (url.includes('http://') && !url.includes('localhost')) {
      analysis.score += 15;
      analysis.issues.push('Uses HTTP instead of HTTPS');
    }

    // Check for IP address instead of domain
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    try {
      const hostname = new URL(url).hostname;
      if (ipRegex.test(hostname)) {
        analysis.score += 20;
        analysis.issues.push('Uses IP address instead of domain name');
      }
    } catch (e) {}

    // Check for suspicious subdomains
    if (url.includes('login-') || url.includes('secure-') || url.includes('verify-')) {
      analysis.score += 10;
      analysis.issues.push('Suspicious subdomain pattern');
    }

    // Check URL length
    if (url.length > 100) {
      analysis.score += 5;
      analysis.issues.push('Unusually long URL');
    }

    // Check for suspicious characters
    if (url.includes('@') || url.includes('\\')) {
      analysis.score += 15;
      analysis.issues.push('Contains suspicious characters');
    }

    analysis.details = {
      length: url.length,
      hasHTTPS: url.startsWith('https://'),
      hasIP: ipRegex.test(url)
    };

    return analysis;
  }

  async analyzeDomain(hostname) {
    const analysis = {
      score: 0,
      issues: [],
      details: {}
    };

    if (!hostname) {
      analysis.score += 25;
      analysis.issues.push('No valid hostname');
      return analysis;
    }

    try {
      // Use external domain reputation service
      const reputationResult = await this.domainReputationService.getDomainReputation(hostname);
      
      analysis.details.reputation = reputationResult;
      analysis.details.isTrusted = reputationResult.isTrusted;
      
      // Adjust risk score based on reputation
      if (!reputationResult.isTrusted) {
        const riskPenalty = 100 - reputationResult.reputationScore;
        analysis.score += Math.min(riskPenalty * 0.3, 15); // Cap at 15 points
        
        if (reputationResult.issues && reputationResult.issues.length > 0) {
          analysis.issues.push(...reputationResult.issues);
        } else if (!reputationResult.fallback) {
          analysis.issues.push('Domain has low reputation score');
        } else {
          analysis.issues.push('Domain not in trusted list (fallback mode)');
        }
      }
      
      // Add confidence information
      analysis.details.confidence = reputationResult.confidence;
      analysis.details.sources = reputationResult.sources;
      
    } catch (error) {
      console.error('Domain reputation check failed:', error);
      
      // Fallback to original logic if API fails
      const isTrusted = this.trustedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isTrusted) {
        analysis.score += 5;
        analysis.issues.push('Domain not in trusted list (fallback)');
      }
      
      analysis.details.isTrusted = isTrusted;
      analysis.details.fallback = true;
      analysis.details.reputationError = error.message;
    }

    // Check for typosquatting patterns
    const typosquattingScore = this.detectTyposquatting(hostname);
    analysis.score += typosquattingScore.score;
    if (typosquattingScore.issues.length > 0) {
      analysis.issues.push(...typosquattingScore.issues);
    }

    // Check domain age (simplified)
    try {
      const whoisData = await this.getDomainAge(hostname);
      analysis.details.whois = whoisData;
      
      if (whoisData.isNew && whoisData.ageInDays < 30) {
        analysis.score += 10;
        analysis.issues.push('Domain is very new (less than 30 days)');
      }
    } catch (error) {
      analysis.details.whoisError = error.message;
    }

    return analysis;
  }

  detectTyposquatting(hostname) {
    const analysis = {
      score: 0,
      issues: []
    };

    // Common typosquatting patterns
    const suspiciousPatterns = [
      /microsoft/g, /googIe/g, /faceb00k/g, /amaz0n/g,
      /paypaI/g, /appIe/g, /tw1tter/g, /netfIix/g
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(hostname)) {
        analysis.score += 15;
        analysis.issues.push('Possible typosquatting detected');
      }
    });

    // Check for character substitution (only flag if it looks like typosquatting)
    const suspiciousSubstitutions = [
      /g00gle/i, /googIe/i, /faceb00k/i, /amaz0n/i,
      /paypaI/i, /appIe/i, /tw1tter/i, /netfIix/i,
      /m1crosoft/i, /y0utube/i
    ];
    
    const hasSuspiciousSubstitutions = suspiciousSubstitutions.some(pattern => 
      pattern.test(hostname)
    );
    
    if (hasSuspiciousSubstitutions) {
      analysis.score += 15;
      analysis.issues.push('Contains suspicious character substitutions (possible typosquatting)');
    }

    return analysis;
  }

  async getDomainAge(hostname) {
    return new Promise((resolve) => {
      try {
        whois.lookup(hostname, (err, data) => {
          if (err) {
            console.warn('WHOIS lookup failed:', err.message);
            resolve({ error: err.message, isNew: false, ageInDays: null });
          } else {
            try {
              // Simplified age calculation
              const creationMatch = data.match(/Creation Date: (.+)/);
              if (creationMatch) {
                const creationDate = new Date(creationMatch[1]);
                const now = new Date();
                const ageInDays = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));
                resolve({
                  creationDate: creationMatch[1],
                  ageInDays: ageInDays,
                  isNew: ageInDays < 90
                });
              } else {
                resolve({ isNew: false, ageInDays: null });
              }
            } catch (parseError) {
              console.warn('Date parsing failed:', parseError.message);
              resolve({ isNew: false, ageInDays: null });
            }
          }
        });
      } catch (error) {
        console.warn('WHOIS lookup error:', error.message);
        resolve({ error: error.message, isNew: false, ageInDays: null });
      }
    });
  }

  async analyzeContent(url) {
    const analysis = {
      accessible: false,
      score: 0,
      issues: [],
      details: {}
    };

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        maxRedirects: 5
      });

      analysis.accessible = true;
      analysis.details.statusCode = response.status;
      analysis.details.contentLength = response.data.length;

      const $ = cheerio.load(response.data);
      
      // Check for suspicious content
      const title = $('title').text().toLowerCase();
      const bodyText = $('body').text().toLowerCase();

      // Check for urgent language
      const urgentWords = ['urgent', 'immediate', 'verify now', 'act now', 'expires soon'];
      const hasUrgentLanguage = urgentWords.some(word => 
        title.includes(word) || bodyText.includes(word)
      );

      if (hasUrgentLanguage) {
        analysis.score += 10;
        analysis.issues.push('Contains urgent language');
      }

      // Check for form fields
      const formFields = $('input[type="password"], input[type="text"]').length;
      if (formFields > 3) {
        analysis.score += 8;
        analysis.issues.push('Contains many input fields');
      }

      // Check for external resources
      const parsedUrl = new URL(url);
      const currentHostname = parsedUrl.hostname;
      const externalScripts = $('script[src]').filter(function() {
        const src = $(this).attr('src');
        return src && !src.startsWith('/') && !src.includes(currentHostname);
      }).length;

      if (externalScripts > 5) {
        analysis.score += 5;
        analysis.issues.push('Many external scripts loaded');
      }

      analysis.details = {
        title: $('title').text(),
        hasForms: $('form').length > 0,
        formFields: formFields,
        externalScripts: externalScripts,
        hasUrgentLanguage: hasUrgentLanguage
      };

    } catch (error) {
      analysis.accessible = false;
      analysis.details.error = error.message;
      
      if (error.code === 'ENOTFOUND') {
        analysis.score += 20;
        analysis.issues.push('Domain not found');
      } else if (error.code === 'ECONNREFUSED') {
        analysis.score += 15;
        analysis.issues.push('Connection refused');
      }
    }

    return analysis;
  }

  async checkSSL(url) {
    const analysis = {
      hasSSL: false,
      score: 0,
      issues: [],
      details: {}
    };

    try {
      if (url.startsWith('https://')) {
        analysis.hasSSL = true;
        analysis.details.protocol = 'HTTPS';
        
        // In a real implementation, you'd check certificate validity
        // For now, we'll just check if HTTPS is used
      } else {
        analysis.score += 20;
        analysis.issues.push('No SSL certificate (HTTP instead of HTTPS)');
        analysis.details.protocol = 'HTTP';
      }
    } catch (error) {
      analysis.score += 15;
      analysis.issues.push('SSL check failed');
      analysis.details.error = error.message;
    }

    return analysis;
  }

  async checkVirusTotal(url) {
    const analysis = {
      isThreat: false,
      score: 0,
      issues: [],
      details: {},
      threatTypes: [],
      confidence: 'unknown',
      source: 'VirusTotal'
    };

    try {
      // Check if VirusTotal service is available
      if (!this.virusTotalService.isAvailable()) {
        analysis.details.error = 'VirusTotal service unavailable';
        analysis.details.serviceStatus = this.virusTotalService.getStatus();
        return analysis;
      }

      // Perform the check
      const virusTotalResult = await this.virusTotalService.checkUrl(url);
      
      analysis.details = virusTotalResult;
      analysis.isThreat = virusTotalResult.isThreat;
      analysis.threatTypes = virusTotalResult.threatTypes;
      analysis.confidence = virusTotalResult.confidence;

      if (virusTotalResult.isThreat) {
        // Calculate risk score based on threat types and detection ratio
        const detectionRatio = virusTotalResult.details?.positives > 0 && virusTotalResult.details?.total > 0 
          ? virusTotalResult.details.positives / virusTotalResult.details.total 
          : 0;
        analysis.score = this.virusTotalService.getRiskScore(virusTotalResult.threatTypes, detectionRatio);
        
        // Add specific issues based on threat types
        virusTotalResult.threatTypes.forEach(threatType => {
          const description = this.virusTotalService.getThreatTypeDescription(threatType);
          analysis.issues.push(`VirusTotal: ${description}`);
        });

        // Add detection details
        if (virusTotalResult.details?.positives > 0) {
          analysis.issues.push(`Detected by ${virusTotalResult.details.positives}/${virusTotalResult.details.total} engines`);
        }

        console.log(`🚨 VirusTotal detected threat for ${url}: ${virusTotalResult.threatTypes.join(', ')} (${virusTotalResult.details?.positives}/${virusTotalResult.details?.total} detections)`);
      } else if (virusTotalResult.confidence === 'high') {
        // High confidence that it's safe - small bonus
        analysis.score = -5; // Negative score to reduce overall risk
        analysis.details.safe = true;
      }

      if (virusTotalResult.error) {
        analysis.details.error = virusTotalResult.error;
        analysis.confidence = 'unknown';
      }

    } catch (error) {
      console.error('VirusTotal check failed:', error.message);
      analysis.details.error = error.message;
      analysis.confidence = 'unknown';
    }

    return analysis;
  }

  determineRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW-MEDIUM';
    return 'LOW';
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.isPhishing) {
      recommendations.push('🚨 HIGH RISK: Do not enter any personal information');
      recommendations.push('❌ Do not click on any links in this website');
      recommendations.push('🔒 Report this site to your security team');
    }

    if (analysis.details.urlAnalysis?.issues.length > 0) {
      recommendations.push('⚠️ URL structure shows suspicious patterns');
    }

    if (!analysis.details.sslAnalysis?.hasSSL) {
      recommendations.push('🔓 Website does not use SSL encryption');
    }

    if (analysis.details.domainAnalysis?.issues.includes('Domain not in trusted list')) {
      recommendations.push('🔍 Verify this is the official website');
    }

    // Enhanced threat intelligence recommendations (from VirusTotal data)
    if (analysis.details.virusTotalAnalysis?.isThreat) {
      recommendations.push('🚨 THREAT INTELLIGENCE WARNING: This site is flagged as malicious');
      recommendations.push('⚠️ Multiple security threats detected');
      if (analysis.details.virusTotalAnalysis.details?.positives > 0) {
        recommendations.push(`🔍 Confirmed by ${analysis.details.virusTotalAnalysis.details.positives} security engines`);
      }
      recommendations.push('🛡️ Avoid this website completely');
    }

    if (analysis.riskScore < 20) {
      recommendations.push('✅ Website appears to be legitimate');
    }

    return recommendations;
  }
}

module.exports = new PhishingDetector();
