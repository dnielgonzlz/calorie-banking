import { UserInfo, Macros } from '../models';
import { BMR_CONSTANTS, MACRO_CONSTANTS } from '../constants';

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export const calculateBMR = (userInfo: UserInfo): number => {
  const { age, height, weight, sex, activityLevel } = userInfo;
  
  const ageNum = parseFloat(age);
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  const activityNum = parseFloat(activityLevel);
  
  const constants = sex === 'male' ? BMR_CONSTANTS.MALE : BMR_CONSTANTS.FEMALE;
  
  const bmr = constants.BASE + 
    (constants.WEIGHT_MULTIPLIER * weightNum) + 
    (constants.HEIGHT_MULTIPLIER * heightNum) - 
    (constants.AGE_MULTIPLIER * ageNum);
  
  return bmr * activityNum;
};

/**
 * Calculate macro distribution based on BMR and preferences
 */
export const calculateMacros = (
  bmr: number,
  weight: number,
  proteinIntakePerKg: number,
  carbFatSplitPercentage: number
): Macros => {
  // Calculate protein calories
  const proteinCalories = weight * proteinIntakePerKg * MACRO_CONSTANTS.PROTEIN_CALORIES_PER_GRAM;
  
  // Calculate remaining calories for carbs and fats
  const remainingCalories = bmr - proteinCalories;
  
  // Ensure minimum fat percentage
  const minFatCalories = remainingCalories * MACRO_CONSTANTS.MIN_FAT_PERCENTAGE;
  const fatCaloriesFromSplit = remainingCalories * (1 - carbFatSplitPercentage / 100);
  const fatCalories = Math.max(minFatCalories, fatCaloriesFromSplit);
  
  // Calculate carb calories
  const carbCalories = remainingCalories - fatCalories;
  
  return {
    protein: Math.round(weight * proteinIntakePerKg),
    carbs: Math.round(carbCalories / MACRO_CONSTANTS.CARB_CALORIES_PER_GRAM),
    fats: Math.round(fatCalories / MACRO_CONSTANTS.FAT_CALORIES_PER_GRAM),
  };
}; 