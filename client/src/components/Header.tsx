import React from 'react';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-effect">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center" aria-hidden>
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm md:text-base font-semibold">Phishing Detection and Response System</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
