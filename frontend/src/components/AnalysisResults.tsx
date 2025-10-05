import React from 'react';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { AnalysisResult } from '../types/types';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  url: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, url }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Risk Analysis Summary</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getRiskIcon(analysis.riskLevel)}</span>
            <Badge className={getRiskColor(analysis.riskLevel)}>
              {analysis.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analysis.riskScore}</div>
            <div className="text-sm text-muted-foreground">Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1)}
            </div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {analysis.isThreat ? '🚨' : '✅'}
            </div>
            <div className="text-sm text-muted-foreground">Threat Status</div>
          </div>
        </div>

        {analysis.issues.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Issues Found:</h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.issues.map((issue, index) => (
                <li key={index} className="text-sm text-muted-foreground">{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Recommendations:</h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-muted-foreground">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* URL Structure */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">URL Structure Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valid URL:</span>
              <Badge variant={analysis.analysis.urlStructure.isValid ? 'success' : 'danger'}>
                {analysis.analysis.urlStructure.isValid ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Protocol:</span>
              <span className="text-sm">{analysis.analysis.urlStructure.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Domain:</span>
              <span className="text-sm">{analysis.analysis.urlStructure.domain}</span>
            </div>
            {analysis.analysis.urlStructure.issues.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Issues:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.analysis.urlStructure.issues.map((issue, index) => (
                    <li key={index} className="text-xs text-muted-foreground">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Domain Reputation */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Domain Reputation</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Trusted Domain:</span>
              <Badge variant={analysis.analysis.domainReputation.isTrusted ? 'success' : 'warning'}>
                {analysis.analysis.domainReputation.isTrusted ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Domain Age:</span>
              <span className="text-sm">{analysis.analysis.domainReputation.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Registrar:</span>
              <span className="text-sm">{analysis.analysis.domainReputation.registrar}</span>
            </div>
            {analysis.analysis.domainReputation.issues.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Issues:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.analysis.domainReputation.issues.map((issue, index) => (
                    <li key={index} className="text-xs text-muted-foreground">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* SSL Analysis */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">SSL/TLS Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valid Certificate:</span>
              <Badge variant={analysis.analysis.sslAnalysis.hasValidCertificate ? 'success' : 'danger'}>
                {analysis.analysis.sslAnalysis.hasValidCertificate ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Certificate Issuer:</span>
              <span className="text-sm">{analysis.analysis.sslAnalysis.certificateIssuer}</span>
            </div>
            {analysis.analysis.sslAnalysis.issues.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Issues:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.analysis.sslAnalysis.issues.map((issue, index) => (
                    <li key={index} className="text-xs text-muted-foreground">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* Analysis Metadata */}
      <Card className="p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Analysis Source: {analysis.source}</span>
          <span>Analyzed: {new Date(analysis.timestamp).toLocaleString()}</span>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisResults;
