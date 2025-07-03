export interface UserInfo {
  age: string;
  height: string;
  weight: string;
  sex: 'male' | 'female';
  activityLevel: string;
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface ValidationErrors {
  age: string;
  height: string;
  weight: string;
}

export type Sex = 'male' | 'female';

export interface ActivityLevel {
  value: string;
  label: string;
} 