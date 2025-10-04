import React, { useState } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 animate-float">
              🛡️ Phishing Detection System
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Protect yourself from malicious websites. Enter a URL to analyze its safety.
            </p>
          </div>

          <UrlInput 
            onAnalysis={handleAnalysis}
            onLoading={handleLoading}
            onError={handleError}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="mt-8 flex justify-center">
              <div className="glass-effect rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Analyzing URL...</p>
                <p className="text-white/70 text-sm mt-2">This may take a few seconds</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
                <div className="text-red-100 text-xl mb-2">⚠️ Error</div>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {analysisResult && !isLoading && (
            <ResultsDisplay result={analysisResult} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
