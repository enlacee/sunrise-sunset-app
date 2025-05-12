import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, Loader2 } from 'lucide-react';
import { useSunData } from '../context/SunDataContext';

const SearchForm = () => {
  const { loading, fetchSunData } = useSunData();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    location?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      location?: string;
      startDate?: string;
      endDate?: string;
      dateRange?: string;
    } = {};
    
    if (!location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dateRange = 'End date must be after start date';
    }
    
    // Limit the date range to 30 days to prevent excessive API calls
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
      const diffTime = Math.abs(endDateTime - startDateTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        errors.dateRange = 'Date range cannot exceed 30 days';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * start run code
   * 
   * @param e 
   * @returns 
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await fetchSunData({
        location,
        startDate,
        endDate,
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getOneWeekFromToday = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  const setCurrentWeek = () => {
    setStartDate(getToday());
    setEndDate(getOneWeekFromToday());
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <SearchIcon className="h-5 w-5 text-amber-500 mr-2" />
            <label htmlFor="location" className="block text-slate-700 dark:text-slate-300 font-medium">
              Location
            </label>
          </div>
          <input
            id="location"
            type="text"
            placeholder="Enter city name (e.g., Berlin, Lisbon)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-700 dark:text-white transition-colors ${
              validationErrors.location ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {validationErrors.location && (
            <p className="mt-1 text-red-500 text-sm">{validationErrors.location}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-5 w-5 text-amber-500 mr-2" />
              <label htmlFor="startDate" className="block text-slate-700 dark:text-slate-300 font-medium">
                Start Date
              </label>
            </div>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-700 dark:text-white transition-colors ${
                validationErrors.startDate ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {validationErrors.startDate && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.startDate}</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-5 w-5 text-amber-500 mr-2" />
              <label htmlFor="endDate" className="block text-slate-700 dark:text-slate-300 font-medium">
                End Date
              </label>
            </div>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-700 dark:text-white transition-colors ${
                validationErrors.endDate ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {validationErrors.endDate && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.endDate}</p>
            )}
          </div>
        </div>
        
        {validationErrors.dateRange && (
          <p className="text-red-500 text-sm">{validationErrors.dateRange}</p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            type="button"
            onClick={setCurrentWeek}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline text-sm transition-colors"
          >
            Set to current week
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-md shadow transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="h-5 w-5 mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;