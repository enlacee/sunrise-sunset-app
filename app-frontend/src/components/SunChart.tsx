import React, { useMemo } from 'react';
import { SunData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SunChartProps {
  data: SunData[];
}

const SunChart: React.FC<SunChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  
  // SVG dimensions
  const width = 1000;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const chartData = useMemo(() => {
    // Format and sort the data for the chart
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);
  
  // Calculate the time in minutes from midnight
  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  // X-axis: dates
  const xScale = (index: number) => {
    return padding.left + (index / (chartData.length - 1)) * chartWidth;
  };
  
  // Y-axis: time of day (in minutes from midnight)
  const yScale = (minutes: number) => {
    // 1440 is the number of minutes in a day
    const minTime = 240; // 4am
    const maxTime = 1200; // 8pm
    const normalizedValue = (minutes - minTime) / (maxTime - minTime);
    return padding.top + (1 - normalizedValue) * chartHeight;
  };
  
  // Generate points for the sunrise line
  const sunriseLine = chartData.map((item, index) => {
    const x = xScale(index);
    const y = yScale(timeToMinutes(item.sunrise));
    return `${x},${y}`;
  }).join(' ');
  
  // Generate points for the sunset line
  const sunsetLine = chartData.map((item, index) => {
    const x = xScale(index);
    const y = yScale(timeToMinutes(item.sunset));
    return `${x},${y}`;
  }).join(' ');
  
  // Generate the X-axis tick marks
  const xAxisTicks = chartData.map((item, index) => {
    if (chartData.length <= 7 || index % Math.ceil(chartData.length / 7) === 0) {
      const x = xScale(index);
      return (
        <g key={index} transform={`translate(${x}, ${padding.top + chartHeight})`}>
          <line y2="6" stroke={isDarkMode ? "#94a3b8" : "#475569"} />
          <text
            y="20"
            textAnchor="middle"
            fill={isDarkMode ? "#94a3b8" : "#475569"}
            style={{ fontSize: "12px" }}
          >
            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </text>
        </g>
      );
    }
    return null;
  });
  
  // Generate the Y-axis tick marks
  const yAxisTicks = [
    { minutes: 360, label: "6:00" },  // 6am
    { minutes: 720, label: "12:00" }, // 12pm
    { minutes: 1080, label: "18:00" }, // 6pm
  ].map((tick, index) => {
    const y = yScale(tick.minutes);
    return (
      <g key={index} transform={`translate(${padding.left}, ${y})`}>
        <line x2="-6" stroke={isDarkMode ? "#94a3b8" : "#475569"} />
        <text
          x="-10"
          y="4"
          textAnchor="end"
          fill={isDarkMode ? "#94a3b8" : "#475569"}
          style={{ fontSize: "12px" }}
        >
          {tick.label}
        </text>
        <line
          x2={chartWidth}
          stroke={isDarkMode ? "#334155" : "#e2e8f0"}
          strokeDasharray="3,3"
        />
      </g>
    );
  });

  return (
    <div className="w-full h-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* Chart background */}
        <rect
          x={padding.left}
          y={padding.top}
          width={chartWidth}
          height={chartHeight}
          fill={isDarkMode ? "#1e293b" : "#f8fafc"}
          rx={4}
        />
        
        {/* Gradient golden area between sunrise and sunset */}
        <defs>
          <linearGradient id="goldenHourGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDarkMode ? "rgba(251, 146, 60, 0.15)" : "rgba(251, 191, 36, 0.2)"} />
            <stop offset="100%" stopColor={isDarkMode ? "rgba(251, 146, 60, 0.05)" : "rgba(251, 191, 36, 0.05)"} />
          </linearGradient>
        </defs>
        
        {/* Sunrise-Sunset area */}
        <path
          d={`M ${xScale(0)},${yScale(timeToMinutes(chartData[0].sunrise))} 
              ${sunriseLine} 
              L ${xScale(chartData.length-1)},${yScale(timeToMinutes(chartData[chartData.length-1].sunset))} 
              ${sunsetLine.split(' ').reverse().join(' ')} Z`}
          fill="url(#goldenHourGradient)"
          opacity="0.8"
        />
        
        {/* X and Y axes */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke={isDarkMode ? "#64748b" : "#64748b"}
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke={isDarkMode ? "#64748b" : "#64748b"}
        />
        
        {/* Axis labels */}
        <text
          x={padding.left + chartWidth / 2}
          y={height - 10}
          textAnchor="middle"
          fill={isDarkMode ? "#94a3b8" : "#475569"}
          style={{ fontSize: "14px" }}
        >
          Date
        </text>
        <text
          transform={`translate(15, ${padding.top + chartHeight / 2}) rotate(-90)`}
          textAnchor="middle"
          fill={isDarkMode ? "#94a3b8" : "#475569"}
          style={{ fontSize: "14px" }}
        >
          Time of Day
        </text>
        
        {/* Axis ticks */}
        {xAxisTicks}
        {yAxisTicks}
        
        {/* Sunrise line */}
        <polyline
          points={sunriseLine}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Sunset line */}
        <polyline
          points={sunsetLine}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points - Sunrise */}
        {chartData.map((item, index) => (
          <circle
            key={`sunrise-${index}`}
            cx={xScale(index)}
            cy={yScale(timeToMinutes(item.sunrise))}
            r="4"
            fill="#f97316"
            stroke="white"
            strokeWidth="1.5"
          />
        ))}
        
        {/* Data points - Sunset */}
        {chartData.map((item, index) => (
          <circle
            key={`sunset-${index}`}
            cx={xScale(index)}
            cy={yScale(timeToMinutes(item.sunset))}
            r="4"
            fill="#7c3aed"
            stroke="white"
            strokeWidth="1.5"
          />
        ))}
        
        {/* Legend */}
        <g transform={`translate(${padding.left + 20}, ${padding.top + 20})`}>
          <circle cx="6" cy="6" r="6" fill="#f97316" />
          <text x="20" y="10" fill={isDarkMode ? "#e2e8f0" : "#334155"} style={{ fontSize: "14px" }}>
            Sunrise
          </text>
          <circle cx="6" cy="36" r="6" fill="#7c3aed" />
          <text x="20" y="40" fill={isDarkMode ? "#e2e8f0" : "#334155"} style={{ fontSize: "14px" }}>
            Sunset
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SunChart;