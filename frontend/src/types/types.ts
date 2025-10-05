export interface AnalysisResult {
  url: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  isThreat: boolean;
  confidence: 'low' | 'medium' | 'high';
  analysis: {
    urlStructure: {
      isValid: boolean;
      protocol: string;
      domain: string;
      path: string;
      issues: string[];
    };
    domainReputation: {
      isTrusted: boolean;
      age: string;
      registrar: string;
      issues: string[];
    };
    contentAnalysis: {
      isAccessible: boolean;
      hasSuspiciousContent: boolean;
      issues: string[];
    };
    sslAnalysis: {
      hasValidCertificate: boolean;
      certificateIssuer: string;
      issues: string[];
    };
    virusTotal: {
      isMalicious: boolean;
      detectionCount: number;
      lastAnalysis: string;
      issues: string[];
    };
  };
  timestamp: string;
  source: string;
  issues: string[];
  recommendations: string[];
}
