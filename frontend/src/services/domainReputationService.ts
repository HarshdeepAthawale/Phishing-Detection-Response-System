/**
 * Domain Reputation Service - Client-side fallback
 * Provides basic domain analysis when backend is unavailable
 */
class DomainReputationService {
  private trustedDomains = [
    'google.com',
    'facebook.com',
    'amazon.com',
    'microsoft.com',
    'apple.com',
    'github.com',
    'stackoverflow.com',
    'wikipedia.org',
    'youtube.com',
    'twitter.com',
    'linkedin.com',
    'instagram.com',
    'netflix.com',
    'spotify.com',
    'dropbox.com'
  ];

  async checkDomainReputation(domain: string): Promise<{
    isTrusted: boolean;
    reputation: 'trusted' | 'neutral' | 'suspicious';
    issues: string[];
  }> {
    try {
      const cleanDomain = this.cleanDomain(domain);
      const isTrusted = this.trustedDomains.includes(cleanDomain);
      
      const issues: string[] = [];
      let reputation: 'trusted' | 'neutral' | 'suspicious' = 'neutral';
      
      if (isTrusted) {
        reputation = 'trusted';
      } else {
        // Check for suspicious patterns
        if (cleanDomain.includes('-')) {
          issues.push('Domain contains hyphens (potential typosquatting)');
          reputation = 'suspicious';
        }
        
        if (cleanDomain.length > 20) {
          issues.push('Domain name is unusually long');
          reputation = 'suspicious';
        }
        
        // Check for common phishing patterns
        const suspiciousKeywords = ['secure', 'login', 'account', 'verify', 'update'];
        const hasSuspiciousKeyword = suspiciousKeywords.some(keyword => 
          cleanDomain.includes(keyword)
        );
        
        if (hasSuspiciousKeyword) {
          issues.push('Domain contains suspicious keywords');
          reputation = 'suspicious';
        }
      }
      
      return {
        isTrusted,
        reputation,
        issues
      };
    } catch (error) {
      return {
        isTrusted: false,
        reputation: 'suspicious',
        issues: ['Error analyzing domain']
      };
    }
  }

  private cleanDomain(domain: string): string {
    return domain.toLowerCase().replace(/^www\./, '').replace(/\/$/, '');
  }

  async checkWhois(domain: string): Promise<{
    registrar: string;
    creationDate: string;
    expirationDate: string;
    status: string;
  }> {
    // Client-side fallback - return mock data
    return {
      registrar: 'Unknown (Client-side fallback)',
      creationDate: 'Unknown',
      expirationDate: 'Unknown',
      status: 'Unknown'
    };
  }
}

export default DomainReputationService;
