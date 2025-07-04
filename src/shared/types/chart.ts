export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyData {
  name: string;
  Protein: number;
  Carbs: number;
  Fats: number;
  Total: number;
  isBlocked: boolean;
}

export interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: DailyData;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface InteractiveWeeklyChartProps {
  initialMacros: Macros;
  totalCalories: number;
}

export interface ChartClickData {
  activePayload?: { payload: DailyData }[];
  activeTooltipIndex?: number;
} 