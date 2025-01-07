import React from 'react';

interface RadiusSelectorProps {
  radius: number;
  onChange: (radius: number) => void;
}

export function RadiusSelector({ radius, onChange }: RadiusSelectorProps) {
  const radiusOptions = [1, 3, 5, 10, 25];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 font-medium">Search radius:</span>
      <div className="flex space-x-2">
        {radiusOptions.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${radius === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {option} mi
          </button>
        ))}
      </div>
    </div>
  );
}