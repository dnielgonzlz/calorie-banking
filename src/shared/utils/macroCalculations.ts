import { DailyData } from '../types/chart';
import { NUTRITION_CONSTANTS } from '../constants/nutrition';

/**
 * Calculates new macros for a day based on total calories
 * Ensures protein stays constant and maintains proper fat/carb ratios
 */
export const calculateNewDayMacros = (day: DailyData): DailyData => {
  const { CALORIES_PER_GRAM, MIN_FAT_PERCENTAGE } = NUTRITION_CONSTANTS;
  
  const proteinCalories = day.Protein * CALORIES_PER_GRAM.PROTEIN;
  const adjustableCalories = Math.max(day.Total - proteinCalories, 0);
  
  // Ensure fats are at least 20% of adjustable calories
  const minFatCalories = adjustableCalories * MIN_FAT_PERCENTAGE;
  const minFats = Math.ceil(minFatCalories / CALORIES_PER_GRAM.FATS);
  
  const remainingCalories = adjustableCalories - minFatCalories;
  const originalRatio = day.Carbs / (day.Carbs + day.Fats);
  
  let newCarbs = Math.max(0, Math.round((remainingCalories * originalRatio) / CALORIES_PER_GRAM.CARBS));
  const newFats = Math.max(minFats, Math.round((remainingCalories * (1 - originalRatio) + minFatCalories) / CALORIES_PER_GRAM.FATS));
  
  // Adjust carbs if necessary to match the total calories
  const calculatedTotal = proteinCalories + newCarbs * CALORIES_PER_GRAM.CARBS + newFats * CALORIES_PER_GRAM.FATS;
  if (calculatedTotal < day.Total) {
    newCarbs += Math.round((day.Total - calculatedTotal) / CALORIES_PER_GRAM.CARBS);
  }

  return {
    ...day,
    Carbs: newCarbs,
    Fats: newFats,
    Total: proteinCalories + newCarbs * CALORIES_PER_GRAM.CARBS + newFats * CALORIES_PER_GRAM.FATS
  };
};

/**
 * Distributes calories across unlocked days when one day's calories change
 */
export const distributeCalories = (
  weeklyData: DailyData[],
  selectedDay: number,
  newDayCalories: number,
  weeklyTotalCalories: number
): { data: DailyData[]; success: boolean; error?: string } => {
  const oldDayCalories = weeklyData[selectedDay].Total;
  const calorieDifference = newDayCalories - oldDayCalories;
  
  const unlockedDays = weeklyData.filter((day, index) => !day.isBlocked && index !== selectedDay);
  
  if (unlockedDays.length === 0) {
    return {
      data: weeklyData,
      success: false,
      error: "Cannot adjust calories. All other days are blocked."
    };
  }

  const caloriesPerOtherDay = calorieDifference / unlockedDays.length;

  let updatedWeeklyData = weeklyData.map((day, index) => {
    if (index === selectedDay) {
      return calculateNewDayMacros({...day, Total: newDayCalories});
    } else if (!day.isBlocked) {
      return calculateNewDayMacros({...day, Total: day.Total - caloriesPerOtherDay});
    }
    return day;
  });

  // Adjust to maintain weekly total
  const currentWeeklyTotal = updatedWeeklyData.reduce((sum, day) => sum + day.Total, 0);
  const adjustment = (weeklyTotalCalories - currentWeeklyTotal) / unlockedDays.length;
  
  updatedWeeklyData = updatedWeeklyData.map(day => 
    day.isBlocked ? day : calculateNewDayMacros({...day, Total: day.Total + adjustment})
  );

  return {
    data: updatedWeeklyData,
    success: true
  };
}; 