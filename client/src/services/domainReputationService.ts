interface DomainReputationResult {
  domain: string;
  isTrusted: boolean;
  reputationScore: number;
  confidence: 'low' | 'medium' | 'high';
  sources: string[];
  issues: string[];
  details: {
    apivoid?: any;
    threatIntelligence?: any;
    builtWith?: any;
    fallback?: boolean;
  };
  fallback: boolean;
}

interface TrustCheckResult {
  isTrusted: boolean;
  confidence: string;
  source: string;
  fallback: boolean;
}

class DomainReputationService {
  private fallbackTrustedDomains = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
    'linkedin.com', 'github.com', 'stackoverflow.com', 'amazon.com', 'paypal.com',
    'apple.com', 'microsoft.com', 'netflix.com', 'spotify.com', 'reddit.com',
    'wikipedia.org', 'medium.com', 'dropbox.com', 'adobe.com', 'salesforce.com',
    'zoom.us', 'slack.com', 'discord.com', 'twitch.tv', 'ebay.com'
  ];

  /**
   * Get domain reputation from server-side API
   */
  async getDomainReputation(domain: string): Promise<DomainReputationResult> {
    try {
      const response = await fetch('/api/domain-reputation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching domain reputation:', error);
      // Fallback to client-side check
      return this.useFallbackCheck(domain);
    }
  }

  /**
   * Check if domain is trusted using external APIs
   */
  async isDomainTrusted(domain: string): Promise<TrustCheckResult> {
    const reputation = await this.getDomainReputation(domain);
    return {
      isTrusted: reputation.isTrusted,
      confidence: reputation.confidence,
      source: reputation.sources.join(', '),
      fallback: reputation.fallback
    };
  }

  /**
   * Fallback method using static domain list
   */
  private useFallbackCheck(domain: string): DomainReputationResult {
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
        fallback: true
      },
      fallback: true
    };
  }

  /**
   * Check domain reputation using VirusTotal API (free tier)
   * Note: This is a simplified implementation for demonstration
   */
  async checkVirusTotalReputation(domain: string): Promise<any> {
    // Note: In a real implementation, you would need a VirusTotal API key
    // This is just a placeholder to show how it could be implemented
    try {
      // This would require a VirusTotal API key and proper CORS handling
      // For now, we'll simulate a response
      return {
        source: 'VirusTotal',
        score: Math.floor(Math.random() * 100),
        issues: [],
        details: {
          virusTotal: {
            detected: Math.random() > 0.8, // 20% chance of being detected
            lastAnalysis: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      console.error('VirusTotal API error:', error);
      return null;
    }
  }

  /**
   * Check domain reputation using multiple free APIs
   */
  async checkMultipleFreeAPIs(domain: string): Promise<any> {
    try {
      // Check multiple APIs in parallel
      const results = await Promise.allSettled([
        this.checkVirusTotalReputation(domain),
        // Add more free APIs here
      ]);

      const validResults = results
        .filter(result => result.status === 'fulfilled' && (result as PromiseFulfilledResult<any>).value)
        .map(result => (result as PromiseFulfilledResult<any>).value);

      if (validResults.length === 0) {
        return this.useFallbackCheck(domain);
      }

      // Calculate average score
      const totalScore = validResults.reduce((sum, result) => sum + (result.score || 0), 0);
      const averageScore = totalScore / validResults.length;

      return {
        domain: domain,
        isTrusted: averageScore >= 70,
        reputationScore: Math.round(averageScore),
        confidence: validResults.length >= 2 ? 'medium' : 'low',
        sources: validResults.map(r => r.source),
        issues: validResults.flatMap(r => r.issues || []),
        details: Object.assign({}, ...validResults.map(r => r.details || {})),
        fallback: false
      };
    } catch (error) {
      console.error('Error in multiple API check:', error);
      return this.useFallbackCheck(domain);
    }
  }
}

export default DomainReputationService;
export type { DomainReputationResult, TrustCheckResult };
