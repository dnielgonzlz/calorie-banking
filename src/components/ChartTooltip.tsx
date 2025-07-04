import React from 'react';
import { TooltipProps } from '../shared/types/chart';
import { NUTRITION_CONSTANTS, DAY_NAMES_MAP } from '../shared/constants/nutrition';

/**
 * Custom tooltip component for the weekly chart
 */
export const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const { CALORIES_PER_GRAM } = NUTRITION_CONSTANTS;
  
  // Get the day initial from the payload data and map it to full name
  const dayInitial = payload[0]?.payload?.name || label;
  const dayName = DAY_NAMES_MAP[dayInitial as keyof typeof DAY_NAMES_MAP] || dayInitial;

  return (
    <div className="custom-tooltip" style={{ 
      backgroundColor: 'black', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '4px',
      color: 'white'
    }}>
      <p className="label font-semibold">{dayName}</p>
      {payload.map((entry, index) => (
        <p key={`item-${index}`} style={{ color: entry.color }}>
          {`${entry.name}: ${entry.value.toFixed(0)}g (${(
            entry.value * (entry.name === 'Fats' ? CALORIES_PER_GRAM.FATS : CALORIES_PER_GRAM.CARBS)
          ).toFixed(0)} cal)`}
        </p>
      ))}
      <p className="total font-semibold">
        {`Total: ${payload[0].payload.Total.toFixed(0)} cal`}
      </p>
    </div>
  );
}; 