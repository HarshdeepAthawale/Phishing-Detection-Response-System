const axios = require('axios');

class DomainReputationService {
  constructor() {
    // API configurations - you can add your API keys here
    this.apis = {
      apivoid: {
        baseUrl: 'https://endpoint.apivoid.com',
        apiKey: process.env.APIVOID_API_KEY || '', // Add your API key to environment variables
        endpoints: {
          siteTrustworthiness: '/sitetrustworthiness/v1/pay-as-you-go/'
        }
      },
      threatIntelligence: {
        baseUrl: 'https://api.threatintelligenceplatform.com',
        apiKey: process.env.THREAT_INTELLIGENCE_API_KEY || '', // Add your API key to environment variables
        endpoints: {
          domainReputation: '/v1/reputation'
        }
      },
      builtWith: {
        baseUrl: 'https://api.builtwith.com',
        apiKey: process.env.BUILTWITH_API_KEY || '', // Add your API key to environment variables
        endpoints: {
          trust: '/v20/trust'
        }
      }
    };

    // Fallback trusted domains (used when APIs are unavailable)
    this.fallbackTrustedDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
      'linkedin.com', 'github.com', 'stackoverflow.com', 'amazon.com', 'paypal.com',
      'apple.com', 'microsoft.com', 'netflix.com', 'spotify.com', 'reddit.com',
      'wikipedia.org', 'medium.com', 'dropbox.com', 'adobe.com', 'salesforce.com',
      'zoom.us', 'slack.com', 'discord.com', 'twitch.tv', 'ebay.com'
    ];
  }

  /**
   * Get domain reputation from multiple APIs
   * @param {string} domain - The domain to check
   * @returns {Promise<Object>} - Domain reputation analysis
   */
  async getDomainReputation(domain) {
    const results = {
      domain: domain,
      isTrusted: false,
      reputationScore: 0,
      confidence: 'low',
      sources: [],
      issues: [],
      details: {},
      fallback: false
    };

    try {
      // Try multiple APIs in parallel for better accuracy
      const apiResults = await Promise.allSettled([
        this.checkApivoidReputation(domain),
        this.checkThreatIntelligenceReputation(domain),
        this.checkBuiltWithTrust(domain)
      ]);

      let validResults = 0;
      let totalScore = 0;

      apiResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          validResults++;
          const apiResult = result.value;
          results.sources.push(apiResult.source);
          
          if (apiResult.score !== undefined) {
            totalScore += apiResult.score;
          }
          
          if (apiResult.issues) {
            results.issues.push(...apiResult.issues);
          }
          
          // Merge details
          Object.assign(results.details, apiResult.details);
        }
      });

      // Calculate final reputation score
      if (validResults > 0) {
        results.reputationScore = Math.round(totalScore / validResults);
        results.confidence = validResults >= 2 ? 'high' : 'medium';
        
        // Determine if domain is trusted based on reputation score
        results.isTrusted = results.reputationScore >= 70; // 70+ is considered trusted
      } else {
        // All APIs failed, use fallback
        const fallbackResult = await this.useFallbackCheck(domain);
        Object.assign(results, fallbackResult);
      }

    } catch (error) {
      console.error('Error in domain reputation check:', error);
      const fallbackResult = await this.useFallbackCheck(domain);
      Object.assign(results, fallbackResult);
    }

    return results;
  }

  /**
   * Check domain reputation using APIVoid
   */
  async checkApivoidReputation(domain) {
    if (!this.apis.apivoid.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${this.apis.apivoid.baseUrl}${this.apis.apivoid.endpoints.siteTrustworthiness}`, {
        params: {
          key: this.apis.apivoid.apiKey,
          host: domain
        },
        timeout: 15000
      });

      const data = response.data;
      if (data && data.data) {
        const reputation = data.data;
        return {
          source: 'APIVoid',
          score: this.calculateApivoidScore(reputation),
          issues: this.extractApivoidIssues(reputation),
          details: {
            apivoid: {
              risk_score: reputation.risk_score,
              is_secure: reputation.is_secure,
              is_blacklisted: reputation.is_blacklisted,
              suspicious_redirects: reputation.suspicious_redirects,
              ssl_certificate: reputation.ssl_certificate
            }
          }
        };
      }
    } catch (error) {
      console.error('APIVoid API error:', error.message);
    }
    return null;
  }

  /**
   * Check domain reputation using Threat Intelligence Platform
   */
  async checkThreatIntelligenceReputation(domain) {
    if (!this.apis.threatIntelligence.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${this.apis.threatIntelligence.baseUrl}${this.apis.threatIntelligence.endpoints.domainReputation}`, {
        params: {
          apiKey: this.apis.threatIntelligence.apiKey,
          domainName: domain
        },
        timeout: 15000
      });

      const data = response.data;
      if (data && data.reputationScore !== undefined) {
        return {
          source: 'Threat Intelligence Platform',
          score: data.reputationScore,
          issues: data.reputationScore < 50 ? ['Low reputation score'] : [],
          details: {
            threatIntelligence: {
              reputationScore: data.reputationScore,
              category: data.category,
              domainAge: data.domainAge,
              registrar: data.registrar
            }
          }
        };
      }
    } catch (error) {
      console.error('Threat Intelligence API error:', error.message);
    }
    return null;
  }

  /**
   * Check domain trust using BuiltWith
   */
  async checkBuiltWithTrust(domain) {
    if (!this.apis.builtWith.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(`${this.apis.builtWith.baseUrl}${this.apis.builtWith.endpoints.trust}`, {
        params: {
          key: this.apis.builtWith.apiKey,
          domain: domain
        },
        timeout: 15000
      });

      const data = response.data;
      if (data && data.Results && data.Results.length > 0) {
        const result = data.Results[0];
        const score = this.calculateBuiltWithScore(result);
        
        return {
          source: 'BuiltWith',
          score: score,
          issues: this.extractBuiltWithIssues(result),
          details: {
            builtWith: {
              isParked: result.IsParked,
              hasAffiliateLinks: result.HasAffiliateLinks,
              ecommerce: result.Ecommerce,
              technologies: result.Technologies
            }
          }
        };
      }
    } catch (error) {
      console.error('BuiltWith API error:', error.message);
    }
    return null;
  }

  /**
   * Fallback method using static domain list
   */
  async useFallbackCheck(domain) {
    const isTrusted = this.fallbackTrustedDomains.includes(domain) || 
                     this.fallbackTrustedDomains.some(trusted => 
                       domain.endsWith('.' + trusted) || domain === trusted
                     );

    return {
      domain: domain,
      isTrusted: isTrusted,
      reputationScore: isTrusted ? 80 : 30,
      confidence: 'low',
      sources: ['Fallback List'],
      issues: isTrusted ? [] : ['Domain not in trusted list'],
      details: {
        fallback: true,
        method: 'static_list'
      },
      fallback: true
    };
  }

  /**
   * Calculate reputation score from APIVoid data
   */
  calculateApivoidScore(reputation) {
    let score = 100;
    
    if (reputation.is_blacklisted) score -= 50;
    if (reputation.suspicious_redirects) score -= 30;
    if (!reputation.is_secure) score -= 20;
    if (reputation.risk_score > 50) score -= 20;
    
    return Math.max(0, score);
  }

  /**
   * Extract issues from APIVoid data
   */
  extractApivoidIssues(reputation) {
    const issues = [];
    if (reputation.is_blacklisted) issues.push('Domain is blacklisted');
    if (reputation.suspicious_redirects) issues.push('Suspicious redirects detected');
    if (!reputation.is_secure) issues.push('Security issues detected');
    if (reputation.risk_score > 50) issues.push('High risk score');
    return issues;
  }

  /**
   * Calculate reputation score from BuiltWith data
   */
  calculateBuiltWithScore(result) {
    let score = 70; // Base score
    
    if (result.IsParked) score -= 40;
    if (result.HasAffiliateLinks) score -= 20;
    if (result.Ecommerce) score += 10;
    if (result.Technologies && result.Technologies.length > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Extract issues from BuiltWith data
   */
  extractBuiltWithIssues(result) {
    const issues = [];
    if (result.IsParked) issues.push('Domain appears to be parked');
    if (result.HasAffiliateLinks) issues.push('Contains affiliate links');
    return issues;
  }

  /**
   * Check if domain is trusted using external APIs
   */
  async isDomainTrusted(domain) {
    const reputation = await this.getDomainReputation(domain);
    return {
      isTrusted: reputation.isTrusted,
      confidence: reputation.confidence,
      source: reputation.sources.join(', '),
      fallback: reputation.fallback
    };
  }
}

module.exports = DomainReputationService;
