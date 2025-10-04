import React from 'react';
import { Shield, Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="glass-effect rounded-2xl p-8 text-center
                       dark:bg-gray-800/30 dark:border-gray-700/50">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-white dark:text-gray-200" />
            <h3 className="text-xl font-bold text-white dark:text-gray-100">PhishGuard</h3>
          </div>
          
          <p className="text-white/80 mb-4 dark:text-gray-300">
            Stay safe online with our advanced phishing detection system
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Made with care for your security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4" />
              <span>Open Source</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20 dark:border-gray-600/30">
            <p className="text-white/50 text-xs dark:text-gray-500">
              ⚠️ This tool is for educational purposes. Always verify suspicious websites through official channels.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
