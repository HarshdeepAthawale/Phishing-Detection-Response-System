import React, { useState } from 'react';
import Header from './components/Header';
import { Analytics } from '@vercel/analytics/react';
import { analyzeUrl } from './services/phishingService';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisResult] = useState<any>(null);

  const performAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeUrl(url);
      setAnalysisResult(result);
      
      // Update the UI with results
      updateAnalysisUI(result, url);
      
      // Show the results section
      const resultsSection = document.getElementById('analysis-results');
      if (resultsSection) {
        resultsSection.style.display = 'block';
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateAnalysisUI = (result: any, url: string) => {
    // Update risk level
    const riskLevel = document.getElementById('risk-level');
    const riskDescription = document.getElementById('risk-description');
    if (riskLevel && riskDescription) {
      const riskText = result.riskLevel || 'UNKNOWN';
      const riskScore = Math.round(result.riskScore || 0);
      riskLevel.textContent = riskText;
      riskLevel.className = `text-2xl font-bold ${
        riskText === 'HIGH' ? 'text-red-500' : 
        riskText === 'MEDIUM' ? 'text-yellow-500' : 
        riskText === 'LOW' ? 'text-green-500' : 'text-gray-500'
      }`;
      riskDescription.textContent = `${riskScore}% risk score`;
    }

    // Update SSL/TLS status
    const sslStatus = document.getElementById('ssl-status');
    const sslDescription = document.getElementById('ssl-description');
    if (sslStatus && sslDescription) {
      const hasSSL = result.details?.sslAnalysis?.hasSSL || url.startsWith('https://');
      sslStatus.textContent = hasSSL ? '✓' : '✗';
      sslStatus.className = `text-2xl font-bold ${hasSSL ? 'text-green-500' : 'text-red-500'}`;
      sslDescription.textContent = hasSSL ? 'SSL/TLS Enabled' : 'No SSL/TLS';
    }

    // Update domain analysis
    const domainStatus = document.getElementById('domain-status');
    const domainDescription = document.getElementById('domain-description');
    if (domainStatus && domainDescription) {
      const isTrusted = result.details?.domainAnalysis?.details?.isTrusted || false;
      domainStatus.textContent = isTrusted ? '✓' : '⚠';
      domainStatus.className = `text-2xl font-bold ${isTrusted ? 'text-green-500' : 'text-yellow-500'}`;
      domainDescription.textContent = isTrusted ? 'Trusted Domain' : 'Unknown Domain';
    }

    // Update protocol status
    const protocolStatus = document.getElementById('protocol-status');
    const protocolDescription = document.getElementById('protocol-description');
    if (protocolStatus && protocolDescription) {
      const isHTTPS = url.startsWith('https://');
      protocolStatus.textContent = isHTTPS ? 'HTTPS' : 'HTTP';
      protocolStatus.className = `text-2xl font-bold ${isHTTPS ? 'text-green-500' : 'text-red-500'}`;
      protocolDescription.textContent = isHTTPS ? 'Secure Protocol' : 'Insecure Protocol';
    }

    // Update detailed analysis
    const detailedAnalysis = document.getElementById('detailed-analysis');
    if (detailedAnalysis) {
      const issues = [
        ...(result.details?.urlAnalysis?.issues || []),
        ...(result.details?.domainAnalysis?.issues || []),
        ...(result.details?.sslAnalysis?.issues || [])
      ];
      
      if (issues.length > 0) {
        detailedAnalysis.innerHTML = issues.map(issue => 
          `<div className="text-sm text-red-400">⚠ ${issue}</div>`
        ).join('');
      } else {
        detailedAnalysis.innerHTML = '<div className="text-sm text-green-400">✓ No security issues detected</div>';
      }
    }
  };

  return (
        <div className="min-h-dvh bg-background">
          <Header />
          <main className="container mx-auto px-4 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-pretty mb-4">
              URL Threat Analyzer
            </h1>
            <p className="text-muted-foreground mb-8">
              Analyze URLs for security risks, SSL/TLS certificate status, and domain reputation.
            </p>

            {/* URL Analysis Section */}
            <div className="rounded-lg border bg-card glass-effect mb-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">URL Threat Analysis</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter a URL to analyze its security risk level, SSL/TLS certificate status, and domain reputation.
                </p>
                <div className="flex gap-4">
                  <input
                    type="url"
                    placeholder="Enter URL to analyze (e.g., https://example.com)"
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const url = e.currentTarget.value;
                        if (url) {
                          performAnalysis(url);
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                      const url = input?.value;
                      if (url) {
                        performAnalysis(url);
                      }
                    }}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>
            </div>

            {/* URL Analysis Results */}
            <div className="rounded-lg border bg-card glass-effect mb-8" id="analysis-results" style={{ display: 'none' }}>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Risk Level Card */}
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk Level</h3>
                    <div className="text-2xl font-bold" id="risk-level">-</div>
                    <div className="text-xs text-muted-foreground" id="risk-description">Not analyzed</div>
                  </div>
                  
                  {/* SSL/TLS Status Card */}
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">SSL/TLS</h3>
                    <div className="text-2xl font-bold" id="ssl-status">-</div>
                    <div className="text-xs text-muted-foreground" id="ssl-description">Not analyzed</div>
                  </div>
                  
                  {/* Domain Analysis Card */}
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Domain</h3>
                    <div className="text-2xl font-bold" id="domain-status">-</div>
                    <div className="text-xs text-muted-foreground" id="domain-description">Not analyzed</div>
                  </div>
                  
                  {/* HTTP/HTTPS Card */}
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Protocol</h3>
                    <div className="text-2xl font-bold" id="protocol-status">-</div>
                    <div className="text-xs text-muted-foreground" id="protocol-description">Not analyzed</div>
                  </div>
                </div>
                
                {/* Detailed Analysis */}
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-3">Detailed Analysis</h3>
                  <div className="space-y-2" id="detailed-analysis">
                    <div className="text-sm text-muted-foreground">No analysis performed yet.</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Analytics />
        </div>
  );
};

export default App;
