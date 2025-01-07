import React from 'react';
import { Slider } from 'lucide-react';

interface RadiusControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function RadiusControl({ value, onChange }: RadiusControlProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Search Radius</label>
        <span className="text-sm text-gray-500">{value.toFixed(1)}km</span>
      </div>
      <input
        type="range"
        min="0.5"
        max="10"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0.5km</span>
        <span>10km</span>
      </div>
    </div>
  );
}