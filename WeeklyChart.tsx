import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

interface InteractiveWeeklyChartProps {
  initialMacros: Macros;
  totalCalories: number;
}

interface DailyData {
  name: string;
  Protein: number;
  Carbs: number;
  Fats: number;
  Total: number;
}

const InteractiveWeeklyChart: React.FC<InteractiveWeeklyChartProps> = ({ initialMacros, totalCalories }) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(totalCalories);
  const [weeklyTotalCalories, setWeeklyTotalCalories] = useState<number>(totalCalories * 7);

  useEffect(() => {
    const initialDailyData = daysOfWeek.map(day => ({
      name: day,
      Protein: initialMacros.protein,
      Carbs: initialMacros.carbs,
      Fats: initialMacros.fats,
      Total: totalCalories
    }));
    setWeeklyData(initialDailyData);
    setWeeklyTotalCalories(totalCalories * 7);
    console.log('Initial weekly data set:', initialDailyData);
  }, [initialMacros, totalCalories]);

  const handleBarClick = (data: any, index: number) => {
    console.log('Bar clicked:', data, 'Index:', index);
    setSelectedDay(index);
    setSliderValue(data.Total);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    console.log('Slider value changed:', newValue);
    setSliderValue(newValue);
    updateCalories(newValue);
  };

  const updateCalories = (newDayCalories: number) => {
    if (selectedDay === null) return;

    const oldDayCalories = weeklyData[selectedDay].Total;
    const calorieDifference = newDayCalories - oldDayCalories;
    const caloriesPerOtherDay = calorieDifference / (daysOfWeek.length - 1);

    let updatedWeeklyData = weeklyData.map((day, index) => {
      if (index === selectedDay) {
        return calculateNewDayMacros(day, newDayCalories);
      } else {
        const newTotal = day.Total - caloriesPerOtherDay;
        return calculateNewDayMacros(day, newTotal);
      }
    });

    // Adjust to maintain weekly total
    const currentWeeklyTotal = updatedWeeklyData.reduce((sum, day) => sum + day.Total, 0);
    const adjustment = (weeklyTotalCalories - currentWeeklyTotal) / 7;
    
    updatedWeeklyData = updatedWeeklyData.map(day => calculateNewDayMacros(day, day.Total + adjustment));

    console.log('Updated weekly data:', updatedWeeklyData);
    setWeeklyData(updatedWeeklyData);
  };

  const calculateNewDayMacros = (day: DailyData, newTotal: number): DailyData => {
    const proteinCalories = day.Protein * 4;
    const adjustableCalories = Math.max(newTotal - proteinCalories, 0);
    
    // Ensure fats are at least 20% of adjustable calories
    const minFatCalories = adjustableCalories * 0.2;
    const minFats = Math.ceil(minFatCalories / 9);
    
    const remainingCalories = adjustableCalories - minFatCalories;
    const originalRatio = day.Carbs / (day.Carbs + day.Fats);
    
    let newCarbs = Math.max(0, Math.round((remainingCalories * originalRatio) / 4));
    let newFats = Math.max(minFats, Math.round((remainingCalories * (1 - originalRatio) + minFatCalories) / 9));
    
    // Adjust carbs if necessary to match the total calories
    const calculatedTotal = proteinCalories + newCarbs * 4 + newFats * 9;
    if (calculatedTotal < newTotal) {
      newCarbs += Math.round((newTotal - calculatedTotal) / 4);
    }

    return {
      ...day,
      Carbs: newCarbs,
      Fats: newFats,
      Total: proteinCalories + newCarbs * 4 + newFats * 9
    };
  };

  const resetChart = () => {
    const resetData = daysOfWeek.map(day => ({
      name: day,
      Protein: initialMacros.protein,
      Carbs: initialMacros.carbs,
      Fats: initialMacros.fats,
      Total: totalCalories
    }));
    setWeeklyData(resetData);
    setSelectedDay(null);
    setSliderValue(totalCalories);
    console.log('Chart reset. Reset data:', resetData);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}g (${(entry.value * (entry.name === 'Fats' ? 9 : 4)).toFixed(1)} cal)`}
            </p>
          ))}
          <p className="total">{`Total: ${payload[0].payload.Total.toFixed(1)} cal`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 600 }}>
      <ResponsiveContainer>
        <BarChart 
          data={weeklyData} 
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload.length > 0) {
              handleBarClick(data.activePayload[0].payload, data.activeTooltipIndex || 0);
            }
          }}
        >
          <XAxis dataKey="name" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Protein" stackId="a" fill="#8884d8" />
          <Bar dataKey="Carbs" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Fats" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
      {selectedDay !== null && (
        <div>
          <input
            type="range"
            min={Math.max(weeklyData[selectedDay].Protein * 4, 0)}
            max={totalCalories * 1.8}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <p>Calories for {daysOfWeek[selectedDay]}: {sliderValue.toFixed(1)}</p>
        </div>
      )}
      <button onClick={resetChart}>Reset</button>
      <p>Weekly Total Calories: {weeklyData.reduce((sum, day) => sum + day.Total, 0).toFixed(1)}</p>
    </div>
  );
};

export default InteractiveWeeklyChart;