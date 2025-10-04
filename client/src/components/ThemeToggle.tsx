import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = stored ? stored === "dark" : prefersDark;
      document.documentElement.classList.toggle("dark", initial);
      setIsDark(initial);
    } catch {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                 hover:bg-white/20 transition-all duration-300 group
                 dark:bg-black/30 dark:border-white/10 dark:hover:bg-black/40"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-400 transition-all duration-500 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-300 transition-all duration-500 ${
            isDark 
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
                        dark:bg-black dark:border dark:border-white/20">
          {isDark ? 'Light mode' : 'Dark mode'}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2
                        w-0 h-0 border-l-4 border-r-4 border-t-4
                        border-l-transparent border-r-transparent border-t-gray-900
                        dark:border-t-black"></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
