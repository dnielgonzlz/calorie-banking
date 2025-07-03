import { ActivityLevel } from '../models';

// BMR calculation constants (Mifflin-St Jeor Equation)
export const BMR_CONSTANTS = {
  MALE: {
    BASE: 88.362,
    WEIGHT_MULTIPLIER: 13.397,
    HEIGHT_MULTIPLIER: 4.799,
    AGE_MULTIPLIER: 5.677,
  },
  FEMALE: {
    BASE: 447.593,
    WEIGHT_MULTIPLIER: 9.247,
    HEIGHT_MULTIPLIER: 3.098,
    AGE_MULTIPLIER: 4.330,
  },
} as const;

// Activity level options
export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { value: '1.2', label: 'Less than 5,000 steps per day' },
  { value: '1.375', label: '10,000 to 14,999 steps per day' },
  { value: '1.55', label: '15,000 to 19,999 steps per day' },
  { value: '1.725', label: '20,000 to 24,999 steps per day' },
  { value: '1.9', label: '25,000 or more steps per day' },
];

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Only whole numbers are allowed',
  INVALID_AGE: 'Age must be 18 or above',
  INVALID_VALUE: 'Value must be greater than 0',
} as const;

// Macro calculation constants
export const MACRO_CONSTANTS = {
  PROTEIN_CALORIES_PER_GRAM: 4,
  CARB_CALORIES_PER_GRAM: 4,
  FAT_CALORIES_PER_GRAM: 9,
  MIN_FAT_PERCENTAGE: 0.2,
} as const;

// Protein intake range
export const PROTEIN_RANGE = {
  MIN: 1.3,
  MAX: 2.3,
  STEP: 0.1,
} as const;

// Carb/Fat split range
export const CARB_FAT_SPLIT_RANGE = {
  MIN: 0,
  MAX: 80,
  STEP: 1,
} as const; 