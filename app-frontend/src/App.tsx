import React from 'react';
import { SunIcon } from 'lucide-react';
import SunriseHeader from './components/SunriseHeader';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import { SunDataProvider } from './context/SunDataContext';
import { ThemeProvider } from './context/ThemeContext';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <SunDataProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-orange-50 dark:from-slate-900 dark:to-indigo-950 transition-colors duration-300">
          <SunriseHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 mb-4">
                  Sunrise & Sunset Explorer
                </h1>
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">
                  Discover historical sunrise, sunset times and golden hours for any location
                </p>
                <div className="flex justify-center">
                  <SunIcon className="text-amber-500 animate-pulse h-12 w-12" />
                </div>
              </div>
              
              <SearchForm />
              <ResultsDisplay />
            </div>
          </main>
          <Footer />
        </div>
      </SunDataProvider>
    </ThemeProvider>
  );
}

export default App;