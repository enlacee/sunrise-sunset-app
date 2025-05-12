import React, { createContext, useContext, useState } from 'react';
import { SunData, SearchParams } from '../types';
import { mockApiCall } from '../services/mockApi';

interface SunDataContextProps {
  sunData: SunData[] | null;
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
  fetchSunData: (params: SearchParams) => Promise<void>;
}

const SunDataContext = createContext<SunDataContextProps | undefined>(undefined);

export const SunDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sunData, setSunData] = useState<SunData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const fetchSunData = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearchParams(params);
    
    try {
      // For now, we're using mock data until the backend is ready
      // In a real application, this would make an API call to your Ruby backend
      const response = await mockApiCall(params);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch data');
      }
      
      setSunData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSunData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SunDataContext.Provider
      value={{
        sunData,
        loading,
        error,
        searchParams,
        fetchSunData,
      }}
    >
      {children}
    </SunDataContext.Provider>
  );
};

export const useSunData = () => {
  const context = useContext(SunDataContext);
  if (context === undefined) {
    throw new Error('useSunData must be used within a SunDataProvider');
  }
  return context;
};