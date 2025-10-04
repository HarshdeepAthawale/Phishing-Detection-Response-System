import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                 hover:bg-white/20 transition-all duration-300 group
                 dark:bg-gray-800/20 dark:border-gray-700/30 dark:hover:bg-gray-700/30"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-400 transition-all duration-500 ${
            isDarkMode 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-300 transition-all duration-500 ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                        dark:bg-gray-700">
          {isDarkMode ? 'Light mode' : 'Dark mode'}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2
                        w-0 h-0 border-l-4 border-r-4 border-t-4
                        border-l-transparent border-r-transparent border-t-gray-900
                        dark:border-t-gray-700"></div>
      </div>
    </button>
  );
};

export default DarkModeToggle;
