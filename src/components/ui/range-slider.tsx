import React from 'react';

interface RangeSliderProps {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  color: string;
  backgroundColor?: string;
  formatValue?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  name,
  label,
  value,
  min,
  max,
  step,
  unit = '',
  color,
  backgroundColor = '#EAC435',
  formatValue = (val) => val.toString(),
  minLabel,
  maxLabel,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <label 
        htmlFor={name}
        className="block mb-2 text-lg font-semibold text-gray-700"
      >
        {label}: {formatValue(value)}{unit}
      </label>
      <div className="relative h-6">
        <div 
          className="absolute inset-y-0 w-full rounded-full" 
          style={{ backgroundColor }}
        />
        <div 
          className="absolute inset-y-0 left-0 rounded-full" 
          style={{ 
            backgroundColor: color,
            width: `${percentage}%`
          }}
        />
        <input
          id={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${formatValue(value)}${unit}`}
        />
        <div 
          className="absolute top-0 h-6 w-6 bg-white rounded-full shadow pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 12px)`,
            border: `2px solid ${color}`
          }}
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{minLabel || `${min}${unit}`}</span>
          <span>{maxLabel || `${max}${unit}`}</span>
        </div>
      )}
    </div>
  );
}; 