import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSunData } from '../context/SunDataContext';
import SunChart from './SunChart';
import DataTable from './DataTable';
import NoData from './NoData';

const ResultsDisplay = () => {
  const { sunData, loading, error, searchParams } = useSunData();

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 animate-fadeIn">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Error</h3>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Here are some possible reasons:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <li>Invalid location name</li>
              <li>Server unavailable</li>
              <li>No data available for the selected dates</li>
              <li>Network connectivity issues</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mt-4">
              Please try again with a different location or date range.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sunData || sunData.length === 0) {
    return <NoData loading={loading} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 md:p-6 transition-all duration-300">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            Results for {searchParams?.location}
          </span>
          <span className="ml-2 text-slate-500 dark:text-slate-400 font-normal text-sm">
            {new Date(searchParams?.startDate || '').toLocaleDateString()} - 
            {new Date(searchParams?.endDate || '').toLocaleDateString()}
          </span>
        </h2>
        
        <div className="h-80 mb-8">
          <SunChart data={sunData} />
        </div>
        
        <div className="overflow-hidden">
          <DataTable data={sunData} />
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;