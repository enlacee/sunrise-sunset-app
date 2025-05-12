import React from 'react';
import { SunIcon, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SunriseHeader = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm py-4 transition-colors duration-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SunIcon className="h-8 w-8 text-amber-500" />
          <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            SunTracker
          </span>
        </div>
        
        <nav className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default SunriseHeader;