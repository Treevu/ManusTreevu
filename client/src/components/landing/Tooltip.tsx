
import React from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  return (
    <div className="group relative inline-block">
      {children || <span className="text-gray-400 cursor-help">?</span>}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
