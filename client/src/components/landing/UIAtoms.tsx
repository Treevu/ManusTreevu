
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const ScoreBadge: React.FC<{
  label: string;
  value: string | number;
  trend?: string | number;
  icon?: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}> = ({ label, value, trend, icon, variant = 'neutral', size = 'md' }) => {
  const colors = {
    success: 'text-emerald-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    neutral: 'text-gray-500',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className={`font-bold ${size === 'lg' ? 'text-3xl' : 'text-2xl'} ${colors[variant]}`}>
        {value}
      </span>
      {trend && (
        <span className="text-[10px] flex items-center gap-1 text-gray-400 mt-1">
          {variant === 'success' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trend}
        </span>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-full p-4 text-gray-400 text-sm italic">
    {message}
  </div>
);
