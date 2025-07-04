export const NUTRITION_CONSTANTS = {
  CALORIES_PER_GRAM: {
    PROTEIN: 4,
    CARBS: 4,
    FATS: 9,
  },
  MIN_FAT_PERCENTAGE: 0.2,
  CALORIE_MULTIPLIER: 1.8,
} as const;

export const DAYS_OF_WEEK = ['M', 'T', 'W', 'TH', 'F', 'S', 'SN'] as const;

export const DAY_NAMES_MAP = {
  'M': 'Monday',
  'T': 'Tuesday', 
  'W': 'Wednesday',
  'TH': 'Thursday',
  'F': 'Friday',
  'S': 'Saturday',
  'SN': 'Sunday'
} as const;

export const ALERT_DURATION = 3000; // milliseconds 