import { useState, useEffect, useCallback } from 'react';
import { Macros, DailyData, AlertState } from '../../shared/types/chart';
import { DAYS_OF_WEEK, NUTRITION_CONSTANTS } from '../../shared/constants/nutrition';
import { distributeCalories } from '../../shared/utils/macroCalculations';

/**
 * Custom hook for managing weekly chart state and interactions
 */
export const useWeeklyChart = (
  initialMacros: Macros, 
  totalCalories: number, 
  showAlert: (message: string, type: AlertState['type']) => void
) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(totalCalories);
  const [weeklyTotalCalories, setWeeklyTotalCalories] = useState<number>(totalCalories * 7);

  // Initialize weekly data
  useEffect(() => {
    const initialDailyData = DAYS_OF_WEEK.map(day => ({
      name: day,
      Protein: initialMacros.protein,
      Carbs: initialMacros.carbs,
      Fats: initialMacros.fats,
      Total: totalCalories,
      isBlocked: false
    }));
    setWeeklyData(initialDailyData);
    setWeeklyTotalCalories(totalCalories * 7);
  }, [initialMacros, totalCalories]);

  const handleBarClick = useCallback((data: DailyData, index: number) => {
    setSelectedDay(index);
    setSliderValue(data.Total);
  }, []);

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue);
    
    // Update calories immediately when slider changes
    if (selectedDay !== null) {
      const result = distributeCalories(weeklyData, selectedDay, newValue, weeklyTotalCalories);
      
      if (result.success) {
        setWeeklyData(result.data);
      } else if (result.error) {
        showAlert(result.error, 'warning');
      }
    }
  }, [selectedDay, weeklyData, weeklyTotalCalories, showAlert]);

  const toggleDayBlock = useCallback((index: number) => {
    setWeeklyData(prevData => 
      prevData.map((day, i) => 
        i === index ? {...day, isBlocked: !day.isBlocked} : day
      )
    );
  }, []);

  const resetChart = useCallback(() => {
    const resetData = DAYS_OF_WEEK.map(day => ({
      name: day,
      Protein: initialMacros.protein,
      Carbs: initialMacros.carbs,
      Fats: initialMacros.fats,
      Total: totalCalories,
      isBlocked: false
    }));
    setWeeklyData(resetData);
    setSelectedDay(null);
    setSliderValue(totalCalories);
  }, [initialMacros, totalCalories]);

  const getSliderProps = useCallback(() => {
    if (selectedDay === null) return null;
    
    return {
      min: Math.max(weeklyData[selectedDay].Protein * NUTRITION_CONSTANTS.CALORIES_PER_GRAM.PROTEIN, 0),
      max: totalCalories * NUTRITION_CONSTANTS.CALORIE_MULTIPLIER,
      value: sliderValue
    };
  }, [selectedDay, weeklyData, totalCalories, sliderValue]);

  return {
    weeklyData,
    selectedDay,
    sliderValue,
    weeklyTotalCalories,
    handleBarClick,
    handleSliderChange,
    toggleDayBlock,
    resetChart,
    getSliderProps
  };
}; 