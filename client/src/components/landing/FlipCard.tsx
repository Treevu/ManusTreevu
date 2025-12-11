
import React, { useState } from 'react';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  themeColor?: string;
  heightClass?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent, heightClass = 'h-48' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`perspective-1000 cursor-pointer group ${heightClass}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute inset-0 backface-hidden bg-surface border border-white/10 rounded-xl p-4 shadow-lg">
          {frontContent}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center justify-center text-center text-sm text-gray-300 shadow-xl">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
