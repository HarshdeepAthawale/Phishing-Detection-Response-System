import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Phishing Detection System
              </h1>
              <p className="text-sm text-muted-foreground">
                Protect yourself from malicious websites
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
