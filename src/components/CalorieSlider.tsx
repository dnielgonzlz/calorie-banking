import React from 'react';
import { DAYS_OF_WEEK } from '../shared/constants/nutrition';

interface CalorieSliderProps {
  selectedDay: number | null;
  sliderValue: number;
  sliderProps: {
    min: number;
    max: number;
    value: number;
  } | null;
  weeklyTotalCalories: number;
  onSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Slider component for adjusting daily calories
 */
export const CalorieSlider: React.FC<CalorieSliderProps> = ({
  selectedDay,
  sliderValue,
  sliderProps,
  weeklyTotalCalories,
  onSliderChange
}) => {
  if (selectedDay === null || !sliderProps) {
    return null;
  }

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      <input
        type="range"
        min={sliderProps.min}
        max={sliderProps.max}
        value={sliderValue}
        onChange={onSliderChange}
        className="w-4/6 justify-center"
        aria-label={`Adjust calories for ${DAYS_OF_WEEK[selectedDay]}`}
      />
      <p className="text-center mt-2">
        Calories for {DAYS_OF_WEEK[selectedDay]}: {sliderValue.toFixed(0)}
      </p>
      <p className="font-bold px-1 mt-6 text-center">
        Weekly Total Calories: {weeklyTotalCalories.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} calories
      </p>
    </div>
  );
}; 