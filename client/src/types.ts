export interface AnalysisResult {
  url: string;
  isPhishing: boolean;
  riskScore: number;
  riskLevel: 'LOW' | 'LOW-MEDIUM' | 'MEDIUM' | 'HIGH';
  details: {
    clientSideAnalysis?: boolean;
    parsedUrl?: {
      hostname: string;
      protocol: string;
      pathname: string;
    };
    urlAnalysis?: {
      score: number;
      issues: string[];
      details: {
        length: number;
        hasHTTPS: boolean;
        hasIP: boolean;
      };
    };
    domainAnalysis?: {
      score: number;
      issues: string[];
      details: {
        isTrusted: boolean;
        whois?: {
          creationDate?: string;
          ageInDays?: number;
          isNew?: boolean;
        };
      };
    };
    contentAnalysis?: {
      accessible: boolean;
      score: number;
      issues: string[];
      details?: {
        title: string;
        hasForms: boolean;
        formFields: number;
        externalScripts: number;
        hasUrgentLanguage: boolean;
      };
      error?: string;
    };
    sslAnalysis?: {
      hasSSL: boolean;
      score: number;
      issues: string[];
      details: {
        protocol: string;
      };
    };
  };
  recommendations: string[];
}
