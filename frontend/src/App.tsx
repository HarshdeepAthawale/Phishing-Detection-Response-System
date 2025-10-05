import React, { useState } from 'react';
import Header from './components/Header';
import AnalysisResults from './components/AnalysisResults';
import { Analytics } from '@vercel/analytics/react';
import { analyzeUrl } from './services/phishingService';
import { AnalysisResult } from './types/types';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string>('');

  const performAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeUrl(url);
      setAnalysisResult(result);
      setAnalyzedUrl(url);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
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

            {/* Analysis Results */}
            {analysisResult && analyzedUrl && (
              <div className="mb-8">
                <AnalysisResults analysis={analysisResult} url={analyzedUrl} />
              </div>
            )}
          </main>
          <Analytics />
        </div>
  );
};

export default App;
