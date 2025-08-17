import React, { useState } from 'react';
import { IconType } from 'react-icons';

interface CardDisplayProps {
  icon: IconType;
  tooltip: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ icon: Icon, tooltip }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card */}
      <div className="glass-card p-6 h-24 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20 cursor-pointer">
        <Icon 
          className="text-primary-600 dark:text-primary-400 transition-all duration-300 group-hover:text-primary-500 group-hover:scale-110" 
          size={40} 
        />
      </div>
      
      {/* Tooltip */}
      <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg transition-all duration-300 whitespace-nowrap z-10 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        {tooltip}
        {/* Tooltip arrow */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
      </div>
    </div>
  );
};

export default CardDisplay;