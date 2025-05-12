import React from 'react';
import { Sunset, Loader2 } from 'lucide-react';

interface NoDataProps {
  loading: boolean;
}

const NoData: React.FC<NoDataProps> = ({ loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center h-64 animate-fadeIn">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Getting sunrise and sunset data...
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-lg">
          We're fetching the data for your selected location and dates. This should only take a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center h-64 animate-fadeIn">
      <Sunset className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        No data to display yet
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-lg">
        Enter a location and date range to fetch sunrise and sunset information.
      </p>
    </div>
  );
};

export default NoData;