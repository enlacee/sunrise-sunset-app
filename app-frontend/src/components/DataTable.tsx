import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Sunrise, Sunset } from 'lucide-react';
import { SunData } from '../types';
import { calculateDaylight } from '../utils/timeUtils';

interface DataTableProps {
  data: SunData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof SunData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof SunData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    }
  });

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return time;
    }
  };

  const SortIcon = ({ field }: { field: keyof SunData }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-800/60">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center space-x-1">
                <span>Date</span>
                <SortIcon field="date" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('sunrise')}
            >
              <div className="flex items-center space-x-1">
                <Sunrise className="h-4 w-4 text-amber-500 mr-1" />
                <span>Sunrise</span>
                <SortIcon field="sunrise" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('sunset')}
            >
              <div className="flex items-center space-x-1">
                <Sunset className="h-4 w-4 text-purple-500 mr-1" />
                <span>Sunset</span>
                <SortIcon field="sunset" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span>Daylight</span>
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('golden_hour')}
            >
              <div className="flex items-center space-x-1">
                <span>Golden Hour</span>
                <SortIcon field="golden_hour" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {sortedData.map((item, index) => (
            <tr 
              key={index}
              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                {new Date(item.date).toLocaleDateString(undefined, { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center">
                  <Sunrise className="h-4 w-4 text-amber-500 mr-2" />
                  {formatTime(item.sunrise)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center">
                  <Sunset className="h-4 w-4 text-purple-500 mr-2" />
                  {formatTime(item.sunset)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  {calculateDaylight(item.sunrise, item.sunset)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                  {formatTime(item.golden_hour)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;