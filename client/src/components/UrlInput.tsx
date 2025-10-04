import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { analyzeUrl } from '../services/phishingService';

interface UrlInputProps {
  onAnalysis: (result: AnalysisResult) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  onAnalysis, 
  onLoading, 
  onError, 
  isLoading 
}) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl.length > 0) {
      setIsValid(validateUrl(inputUrl));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      onError('Please enter a URL to analyze');
      return;
    }

    if (!isValid) {
      onError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    try {
      onLoading(true);
      const result = await analyzeUrl(url);
      onAnalysis(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to analyze URL');
    } finally {
      onLoading(false);
    }
  };

  const getInputIcon = () => {
    if (isValid === null) return <Search className="w-5 h-5 text-gray-400" />;
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getInputBorderColor = () => {
    if (isValid === null) return 'border-gray-300';
    if (isValid) return 'border-green-500';
    return 'border-red-500';
  };

  return (
    <div className="glass-effect rounded-2xl p-8 shadow-2xl
                   dark:bg-gray-800/30 dark:border-gray-700/50
                   hover:shadow-3xl transition-all duration-300
                   animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 dark:text-gray-100">
          Enter URL to Analyze
        </h2>
        <p className="text-white/80 dark:text-gray-300">
          Get instant security analysis of any website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {getInputIcon()}
          </div>
          <input
            type="url"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className={`w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 ${getInputBorderColor()} 
                     bg-white/10 backdrop-blur-sm text-white placeholder-white/50 
                     dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-400
                     dark:border-gray-600 dark:focus:border-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                     dark:focus:ring-gray-400/50
                     transition-all duration-300`}
            disabled={isLoading}
          />
        </div>

        {url.length > 0 && isValid === false && (
          <p className="text-red-300 text-sm flex items-center space-x-2 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>Please enter a valid URL starting with http:// or https://</span>
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isLoading || !url.trim()}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                     ${!isValid || isLoading || !url.trim()
                       ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                       : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                     }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Analyze URL</span>
            </div>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm dark:text-gray-400">
          🔒 Your analysis is completely private and secure
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
