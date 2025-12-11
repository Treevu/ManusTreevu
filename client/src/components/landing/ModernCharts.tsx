
import React from 'react';

export const StreamlinedAreaChart: React.FC<{
  data: number[];
  color: string;
  gradientColor: string;
  height?: number;
}> = ({ data, color, gradientColor, height = 80 }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ height }} className="w-full overflow-hidden relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${gradientColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,100 ${points} V100 Z`} fill={`url(#grad-${gradientColor})`} />
        <polyline points={points} fill="none" stroke={gradientColor} strokeWidth="2" />
      </svg>
    </div>
  );
};
