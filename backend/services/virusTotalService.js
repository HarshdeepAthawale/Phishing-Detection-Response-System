const axios = require('axios');

/**
 * Professional VirusTotal API Service
 * Using API Key authentication for production use
 */
class VirusTotalService {
  constructor() {
    // API Key from environment or config
    this.apiKey = process.env.VIRUSTOTAL_API_KEY || '15708ef1a8558f61b4f26467f504dc10881ca6a25ce0af1b207a3ccf71ba6fd8';
    this.enabled = process.env.VIRUSTOTAL_ENABLED !== 'false';
    this.apiUrl = 'https://www.virustotal.com/api/v3';
    
    // Production configuration
    this.config = {
      maxRequestsPerMinute: parseInt(process.env.VIRUSTOTAL_MAX_REQUESTS_PER_MINUTE) || 4, // VT free tier limit
      timeoutMs: parseInt(process.env.VIRUSTOTAL_TIMEOUT_MS) || 15000,
      retryAttempts: 3,
      retryDelayMs: 1000
    };
    
    // Rate limiting and monitoring
    this.requestCount = 0;
    this.lastResetTime = Date.now();
    this.errorCount = 0;
    this.successCount = 0;
    this.authError = null;
    
    console.log('✅ VirusTotal API initialized with API Key');
  }

  /**
   * Check if rate limit is exceeded
   */
  isRateLimited() {
    const now = Date.now();
    const timeDiff = now - this.lastResetTime;
    
    if (timeDiff >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    return this.requestCount >= this.config.maxRequestsPerMinute;
  }

  /**
   * Check URL against VirusTotal database
   * @param {string} url - The URL to check
   * @returns {Promise<Object>} - VirusTotal analysis result
   */
  async checkUrl(url) {
    const result = {
      url: url,
      isThreat: false,
      threatTypes: [],
      platformTypes: [],
      threatEntries: [],
      threatEntryTypes: [],
      confidence: 'unknown',
      source: 'VirusTotal',
      error: null,
      lastChecked: new Date().toISOString(),
      details: {
        scanDate: null,
        positives: 0,
        total: 0,
        engines: {},
        permalink: null
      }
    };

    try {
      // Check if enabled
      if (!this.enabled) {
        result.error = 'VirusTotal service is disabled';
        return result;
      }

      // Check rate limiting
      if (this.isRateLimited()) {
        result.error = 'Rate limit exceeded. Please try again later.';
        return result;
      }

      // Increment request counter
      this.requestCount++;

      // First, submit URL for analysis if needed
      const urlId = await this.submitUrl(url);
      
      // Get the analysis report
      const report = await this.getUrlReport(urlId);

      if (report && report.data && report.data.attributes) {
        const attributes = report.data.attributes;
        
        result.details.scanDate = attributes.last_analysis_date ? 
          new Date(attributes.last_analysis_date * 1000).toISOString() : null;
        result.details.positives = attributes.last_analysis_stats?.malicious || 0;
        result.details.total = Object.keys(attributes.last_analysis_results || {}).length;
        result.details.permalink = report.data.links?.self;
        
        // Extract engine results
        if (attributes.last_analysis_results) {
          result.details.engines = {};
          Object.entries(attributes.last_analysis_results).forEach(([engine, data]) => {
            if (data.category === 'malicious' || data.category === 'suspicious') {
              result.details.engines[engine] = {
                category: data.category,
                result: data.result
              };
            }
          });
        }

        // Determine if it's a threat
        if (result.details.positives > 0) {
          result.isThreat = true;
          
          // Categorize threat types based on engine results
          const threatCategories = new Set();
          Object.values(result.details.engines).forEach(engine => {
            if (engine.category === 'malicious') {
              threatCategories.add('MALWARE');
              threatCategories.add('SOCIAL_ENGINEERING');
            } else if (engine.category === 'suspicious') {
              threatCategories.add('SUSPICIOUS');
            }
          });
          
          result.threatTypes = Array.from(threatCategories);
          result.platformTypes = ['ANY_PLATFORM'];
          result.threatEntries = [url];
          result.threatEntryTypes = ['URL'];

          // Set confidence based on detection ratio
          const detectionRatio = result.details.positives / Math.max(result.details.total, 1);
          if (detectionRatio >= 0.5) {
            result.confidence = 'high';
          } else if (detectionRatio >= 0.2) {
            result.confidence = 'medium';
          } else {
            result.confidence = 'low';
          }

          console.log(`🚨 VirusTotal detected threat for ${url}: ${result.details.positives}/${result.details.total} engines flagged it`);
        } else {
          result.confidence = 'high'; // High confidence that it's safe
          console.log(`✅ VirusTotal: ${url} appears to be safe (0/${result.details.total} detections)`);
        }

      } else {
        result.error = 'No analysis data available';
        result.confidence = 'unknown';
      }

    } catch (error) {
      console.error('VirusTotal API error:', error.message);
      
      // Provide more specific error messages
      if (error.message.includes('authentication') || error.message.includes('API key')) {
        result.error = 'API authentication failed - check API key';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        result.error = 'API quota exceeded';
      } else if (error.message.includes('timeout')) {
        result.error = 'Request timeout - please try again';
      } else if (error.response) {
        result.error = `API error: ${error.response.status} - ${error.response.statusText}`;
      } else {
        result.error = `API error: ${error.message}`;
      }
      
      result.confidence = 'unknown';
    }

    return result;
  }

  /**
   * Submit URL for analysis
   * @param {string} url - URL to submit
   * @returns {Promise<string>} - URL ID
   */
  async submitUrl(url) {
    try {
      // Create URL ID by base64 encoding the URL
      const urlId = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      return urlId;
    } catch (error) {
      throw new Error(`Failed to create URL ID: ${error.message}`);
    }
  }

  /**
   * Get URL analysis report
   * @param {string} urlId - URL ID from submitUrl
   * @returns {Promise<Object>} - Analysis report
   */
  async getUrlReport(urlId) {
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        response = await axios.get(
          `${this.apiUrl}/urls/${urlId}`,
          {
            timeout: this.config.timeoutMs,
            headers: {
              'x-apikey': this.apiKey,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Success
        this.successCount++;
        break;
        
      } catch (apiError) {
        lastError = apiError;
        this.errorCount++;
        
        // Don't retry on authentication errors
        if (apiError.response && (apiError.response.status === 401 || apiError.response.status === 403)) {
          throw new Error('API authentication failed - check API key');
        }
        
        // Don't retry on 404 (URL not found in database)
        if (apiError.response && apiError.response.status === 404) {
          throw new Error('URL not found in VirusTotal database');
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelayMs * Math.pow(2, attempt - 1);
          console.log(`⚠️ VirusTotal API call failed (attempt ${attempt}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If all retries failed, throw the last error
    if (!response) {
      throw lastError || new Error('All retry attempts failed');
    }

    return response.data;
  }

  /**
   * Check multiple URLs at once
   * @param {Array<string>} urls - Array of URLs to check
   * @returns {Promise<Array<Object>>} - Array of analysis results
   */
  async checkUrls(urls) {
    const results = [];
    
    // VirusTotal has strict rate limits, so we process one at a time
    for (const url of urls) {
      const result = await this.checkUrl(url);
      results.push(result);
      
      // Add delay between requests to respect rate limits
      if (urls.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15 second delay
      }
    }

    return results;
  }

  /**
   * Get threat type description
   * @param {string} threatType - The threat type
   * @returns {string} - Human readable description
   */
  getThreatTypeDescription(threatType) {
    const descriptions = {
      'MALWARE': 'Malware - Software designed to harm or exploit systems',
      'SOCIAL_ENGINEERING': 'Social Engineering - Phishing and deceptive content',
      'SUSPICIOUS': 'Suspicious - Potentially harmful content',
      'UNWANTED_SOFTWARE': 'Unwanted Software - Potentially unwanted programs',
      'POTENTIALLY_HARMFUL_APPLICATION': 'Potentially Harmful Application - Apps that may be harmful'
    };

    return descriptions[threatType] || threatType;
  }

  /**
   * Get platform type description
   * @param {string} platformType - The platform type
   * @returns {string} - Human readable description
   */
  getPlatformTypeDescription(platformType) {
    const descriptions = {
      'ANY_PLATFORM': 'Any Platform',
      'WINDOWS': 'Windows',
      'LINUX': 'Linux',
      'OSX': 'macOS',
      'ANDROID': 'Android',
      'IOS': 'iOS',
      'ALL_PLATFORMS': 'All Platforms'
    };

    return descriptions[platformType] || platformType;
  }

  /**
   * Get risk score based on threat types and detection ratio
   * @param {Array<string>} threatTypes - Array of threat types
   * @param {number} detectionRatio - Ratio of engines that detected the threat
   * @returns {number} - Risk score (0-100)
   */
  getRiskScore(threatTypes, detectionRatio = 0) {
    let score = 0;

    // Base score from detection ratio
    score = Math.min(detectionRatio * 100, 95);

    // Adjust based on threat types
    threatTypes.forEach(type => {
      switch (type) {
        case 'MALWARE':
          score = Math.max(score, 90);
          break;
        case 'SOCIAL_ENGINEERING':
          score = Math.max(score, 85);
          break;
        case 'SUSPICIOUS':
          score = Math.max(score, 70);
          break;
        case 'POTENTIALLY_HARMFUL_APPLICATION':
          score = Math.max(score, 70);
          break;
        case 'UNWANTED_SOFTWARE':
          score = Math.max(score, 60);
          break;
        default:
          score = Math.max(score, 50);
      }
    });

    return Math.min(Math.round(score), 100);
  }

  /**
   * Check if the service is available
   * @returns {boolean} - Whether the service is available
   */
  isAvailable() {
    return this.enabled && this.apiKey && !this.authError;
  }

  /**
   * Get service status
   * @returns {Object} - Service status information
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      enabled: this.enabled,
      hasApiKey: !!this.apiKey,
      error: this.authError || null,
      serviceName: 'VirusTotal API',
      version: 'v3',
      monitoring: {
        requestsThisMinute: this.requestCount,
        maxRequestsPerMinute: this.config.maxRequestsPerMinute,
        successCount: this.successCount,
        errorCount: this.errorCount,
        successRate: this.successCount + this.errorCount > 0 ? 
          (this.successCount / (this.successCount + this.errorCount) * 100).toFixed(2) + '%' : 'N/A'
      }
    };
  }
}

module.exports = VirusTotalService;
