import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '../@/components/ui/alert';
import { InteractiveWeeklyChartProps, ChartClickData } from './shared/types/chart';
import { useWeeklyChart } from './application/hooks/useWeeklyChart';
import { useAlerts } from './application/hooks/useAlerts';
import { ChartTooltip } from './components/ChartTooltip';
import { DayControls } from './components/DayControls';
import { CalorieSlider } from './components/CalorieSlider';
import { ActionButtons } from './components/ActionButtons';

/**
 * Interactive weekly macro chart component
 * Allows users to adjust daily calories and see macro distributions
 */
const InteractiveWeeklyChart: React.FC<InteractiveWeeklyChartProps> = ({ 
  initialMacros, 
  totalCalories 
}) => {
  const { alert, showAlert } = useAlerts();
  const {
    weeklyData,
    selectedDay,
    sliderValue,
    handleBarClick,
    handleSliderChange,
    toggleDayBlock,
    resetChart,
    getSliderProps
  } = useWeeklyChart(initialMacros, totalCalories, showAlert);

  const handleChartClick = (data: ChartClickData) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      handleBarClick(data.activePayload[0].payload, data.activeTooltipIndex || 0);
    }
  };

  const currentWeeklyTotal = weeklyData.reduce((sum, day) => sum + day.Total, 0);

  return (
    <div className="w-full mt-2">
      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-4">
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={weeklyData} 
          onClick={handleChartClick}
        >
          <XAxis 
            tickFormatter={(index) => ` ${weeklyData[index]?.Total.toFixed(0) || 0} cal`} 
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Bar dataKey="Protein" stackId="a" fill="#7B0D1E" />
          <Bar dataKey="Carbs" stackId="a" fill="#5B8C5A" />
          <Bar dataKey="Fats" stackId="a" fill="#EAC435" />
        </BarChart>
      </ResponsiveContainer>
      
      <DayControls 
        weeklyData={weeklyData} 
        onToggleDayBlock={toggleDayBlock} 
      />
      
      <CalorieSlider
        selectedDay={selectedDay}
        sliderValue={sliderValue}
        sliderProps={getSliderProps()}
        weeklyTotalCalories={currentWeeklyTotal}
        onSliderChange={handleSliderChange}
      />
      
      <ActionButtons
        weeklyData={weeklyData}
        onReset={resetChart}
        onShowAlert={showAlert}
      />
      
      <div className="flex justify-center mb-6">
        <a href="https://www.buymeacoffee.com/danielgonzalez">
          <img 
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=danielgonzalez&button_colour=5F7FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" 
            alt="Buy me a coffee"
          />
        </a>
      </div>
    </div>
  );
};

export default InteractiveWeeklyChart;