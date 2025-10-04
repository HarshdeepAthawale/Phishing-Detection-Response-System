import React, { useState } from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext';
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
    <DarkModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                      transition-all duration-500">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4 animate-float
                             dark:text-gray-100">
                🛡️ Phishing Detection System
              </h1>
              <p className="text-xl text-white/90 mb-8 dark:text-gray-300">
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
                <div className="glass-effect rounded-lg p-8 text-center
                               dark:bg-gray-800/30 dark:border-gray-700/50">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4
                                 dark:border-gray-300"></div>
                  <p className="text-white text-lg dark:text-gray-200">Analyzing URL...</p>
                  <p className="text-white/70 text-sm mt-2 dark:text-gray-400">This may take a few seconds</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8">
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center
                               dark:bg-red-900/20 dark:border-red-400/50">
                  <div className="text-red-100 text-xl mb-2 dark:text-red-300">⚠️ Error</div>
                  <p className="text-red-200 dark:text-red-400">{error}</p>
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
    </DarkModeProvider>
  );
};

export default App;
