import React from 'react';
import { Github as GitHub, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © {new Date().getFullYear()} SunTracker. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
              aria-label="GitHub repository"
            >
              <GitHub className="h-5 w-5" />
            </a>
            
            <a
              href="#"
              className="text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
              aria-label="API Documentation"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-slate-500 dark:text-slate-500">
            Powered by{' '}
            <a
              href="https://sunrise-sunset.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-500 hover:underline"
            >
              Sunrise-Sunset API
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;