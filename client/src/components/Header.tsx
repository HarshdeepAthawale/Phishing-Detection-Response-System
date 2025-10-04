import React from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg dark:bg-gray-800/30
                           hover:bg-white/30 dark:hover:bg-gray-700/40 transition-all duration-300">
              <Shield className="w-8 h-8 text-white dark:text-gray-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-gray-100">PhishGuard</h1>
              <p className="text-white/70 text-sm dark:text-gray-400">Security Scanner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-white/80 dark:text-gray-300">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure Analysis</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-white/80 dark:text-gray-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Real-time Detection</span>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
