import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Globe, 
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400';
      case 'LOW-MEDIUM': return 'text-yellow-400';
      case 'MEDIUM': return 'text-orange-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500/20 border-green-500/50';
      case 'LOW-MEDIUM': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'MEDIUM': return 'bg-orange-500/20 border-orange-500/50';
      case 'HIGH': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getMainIcon = () => {
    if (result.isPhishing) {
      return <XCircle className="w-16 h-16 text-red-400" />;
    } else if (result.riskLevel === 'LOW') {
      return <CheckCircle className="w-16 h-16 text-green-400" />;
    } else {
      return <AlertTriangle className="w-16 h-16 text-yellow-400" />;
    }
  };

  const getMainMessage = () => {
    if (result.isPhishing) {
      return {
        title: "⚠️ PHISHING DETECTED",
        subtitle: "This website appears to be malicious",
        color: "text-red-400"
      };
    } else if (result.riskLevel === 'LOW') {
      return {
        title: "✅ SAFE TO VISIT",
        subtitle: "This website appears to be legitimate",
        color: "text-green-400"
      };
    } else {
      return {
        title: "⚠️ PROCEED WITH CAUTION",
        subtitle: "This website has some suspicious characteristics",
        color: "text-yellow-400"
      };
    }
  };

  const mainMessage = getMainMessage();

  return (
    <div className="mt-8 space-y-6">
      {/* Main Result */}
      <div className={`glass-effect rounded-2xl p-8 border-2 ${getRiskBgColor(result.riskLevel)}`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getMainIcon()}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${mainMessage.color}`}>
            {mainMessage.title}
          </h2>
          <p className="text-white/80 text-lg mb-4">
            {mainMessage.subtitle}
          </p>
          <div className="flex items-center justify-center space-x-4 text-white/70">
            <span>Risk Score: {result.riskScore}/100</span>
            <span>•</span>
            <span className={getRiskColor(result.riskLevel)}>
              Risk Level: {result.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* URL Information */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Website Information</span>
        </h3>
        <div className="space-y-2 text-white/80">
          <div>
            <span className="font-medium">URL:</span> 
            <span className="ml-2 break-all">{result.url}</span>
          </div>
          {result.details.parsedUrl && (
            <>
              <div>
                <span className="font-medium">Domain:</span> 
                <span className="ml-2">{result.details.parsedUrl.hostname}</span>
              </div>
              <div>
                <span className="font-medium">Protocol:</span> 
                <span className="ml-2">{result.details.parsedUrl.protocol}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* URL Analysis */}
        {result.details.urlAnalysis && (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" />
              <span>URL Analysis</span>
            </h3>
            <div className="space-y-2 text-white/80">
              <div>Score Impact: {result.details.urlAnalysis.score} points</div>
              {result.details.urlAnalysis.issues.length > 0 && (
                <div>
                  <span className="font-medium">Issues:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {result.details.urlAnalysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SSL Analysis */}
        {result.details.sslAnalysis && (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>SSL Security</span>
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center space-x-2">
                {result.details.sslAnalysis.hasSSL ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span>
                  {result.details.sslAnalysis.hasSSL ? 'HTTPS Enabled' : 'No SSL Certificate'}
                </span>
              </div>
              <div>Score Impact: {result.details.sslAnalysis.score} points</div>
              {result.details.sslAnalysis.issues.length > 0 && (
                <div>
                  <span className="font-medium">Issues:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {result.details.sslAnalysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Domain Analysis */}
        {result.details.domainAnalysis && (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Domain Analysis</span>
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center space-x-2">
                {result.details.domainAnalysis.details.isTrusted ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
                <span>
                  {result.details.domainAnalysis.details.isTrusted ? 'Trusted Domain' : 'Unknown Domain'}
                </span>
              </div>
              <div>Score Impact: {result.details.domainAnalysis.score} points</div>
              {result.details.domainAnalysis.issues.length > 0 && (
                <div>
                  <span className="font-medium">Issues:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {result.details.domainAnalysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Analysis */}
        {result.details.contentAnalysis && (
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Content Analysis</span>
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center space-x-2">
                {result.details.contentAnalysis.accessible ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span>
                  {result.details.contentAnalysis.accessible ? 'Content Accessible' : 'Content Not Accessible'}
                </span>
              </div>
              <div>Score Impact: {result.details.contentAnalysis.score} points</div>
              {result.details.contentAnalysis.issues.length > 0 && (
                <div>
                  <span className="font-medium">Issues:</span>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {result.details.contentAnalysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Security Recommendations</span>
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {recommendation.includes('🚨') ? (
                    <XCircle className="w-4 h-4 text-red-400" />
                  ) : recommendation.includes('✅') ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <p className="text-white/90 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
