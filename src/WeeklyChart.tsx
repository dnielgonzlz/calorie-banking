import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Lock, Unlock, Clipboard, Share2 } from 'lucide-react';
import {Alert} from '../@/components/ui/alert'

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
  isBlocked: boolean;
}

const InteractiveWeeklyChart: React.FC<InteractiveWeeklyChartProps> = ({ initialMacros, totalCalories }) => {
  const daysOfWeek = ['M', 'T', 'W', 'TH', 'F', 'S', 'SN'];
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(totalCalories);
  const [weeklyTotalCalories, setWeeklyTotalCalories] = useState<number>(totalCalories * 7);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


  useEffect(() => {
    const initialDailyData = daysOfWeek.map(day => ({
      name: day,
      Protein: initialMacros.protein,
      Carbs: initialMacros.carbs,
      Fats: initialMacros.fats,
      Total: totalCalories,
      isBlocked: false
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
    
    const unlockedDays = weeklyData.filter((day, index) => !day.isBlocked && index !== selectedDay);
    
    if (unlockedDays.length === 0) {
      alert("Cannot adjust calories. All other days are blocked.");
      return;
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

    console.log('Updated weekly data:', updatedWeeklyData);
    setWeeklyData(updatedWeeklyData);
  };

  const calculateNewDayMacros = (day: DailyData): DailyData => {
    const proteinCalories = day.Protein * 4;
    const adjustableCalories = Math.max(day.Total - proteinCalories, 0);
    
    // Ensure fats are at least 20% of adjustable calories
    const minFatCalories = adjustableCalories * 0.2;
    const minFats = Math.ceil(minFatCalories / 9);
    
    const remainingCalories = adjustableCalories - minFatCalories;
    const originalRatio = day.Carbs / (day.Carbs + day.Fats);
    
    let newCarbs = Math.max(0, Math.round((remainingCalories * originalRatio) / 4));
    let newFats = Math.max(minFats, Math.round((remainingCalories * (1 - originalRatio) + minFatCalories) / 9));
    
    // Adjust carbs if necessary to match the total calories
    const calculatedTotal = proteinCalories + newCarbs * 4 + newFats * 9;
    if (calculatedTotal < day.Total) {
      newCarbs += Math.round((day.Total - calculatedTotal) / 4);
    }

    return {
      ...day,
      Carbs: newCarbs,
      Fats: newFats,
      Total: proteinCalories + newCarbs * 4 + newFats * 9
    };
  };

  const toggleDayBlock = (index: number) => {
    setWeeklyData(prevData => 
      prevData.map((day, i) => 
        i === index ? {...day, isBlocked: !day.isBlocked} : day
      )
    );
  };

  const resetChart = () => {
    const resetData = daysOfWeek.map(day => ({
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
    console.log('Chart reset. Reset data:', resetData);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'black', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(0)}g (${(entry.value * (entry.name === 'Fats' ? 9 : 4)).toFixed(0)} cal)`}
            </p>
          ))}
          <p className="total">{`Total: ${payload[0].payload.Total.toFixed(0)} cal`}</p>
        </div>
      );
    }
    return null;
  };

  const generateShareText = () => {
    let text = "Hey coach! Here's how I'm planning my weekly macros:\n\n";
    weeklyData.forEach(day => {
      text += `${day.name}: ${day.Total.toFixed(0)} cals / ${day.Protein.toFixed(0)}P / ${day.Fats.toFixed(0)}F / ${day.Carbs.toFixed(0)}C\n`;
    });
    text += "\nLet me know if you want me to make any adjustments!";
    return text;
  };

  const copyToClipboard = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      setAlertMessage("Copied to clipboard successfully!");
      setTimeout(() => setAlertMessage(null), 300);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setAlertMessage("Failed to copy to clipboard.");
      setTimeout(() => setAlertMessage(null), 300);
    });
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
    setAlertMessage("WhatsApp sharing initiated!");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="w-full mt-2">
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={weeklyData} 
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload.length > 0) {
              handleBarClick(data.activePayload[0].payload, data.activeTooltipIndex || 0);
            }
          }}
        >
          <XAxis 
          tickFormatter={(index) => ` ${weeklyData[index].Total} cal`} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Protein" stackId="a" fill="#7B0D1E" />
          <Bar dataKey="Carbs" stackId="a" fill="#5B8C5A" />
          <Bar dataKey="Fats" stackId="a" fill="#EAC435" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4">
        <div className="w-full max-w-4xl flex justify-between px-0 sm:px-2 md:px-4">
          {weeklyData.map((day, index) => (
            <div key={day.name} className="flex flex-col items-center">
              <button 
                onClick={() => toggleDayBlock(index)}
                className="mb-2"
              >
                {day.isBlocked ? 
                  <Lock color="red" size={30} /> : 
                  <Unlock color="grey" size={30} />
                }
              </button>
              <p className="text-center text-black font-bold text-xl">{day.name}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedDay !== null && (
        <div className="w-full mt-6 flex flex-col items-center">
          <input
            type="range"
            min={Math.max(weeklyData[selectedDay].Protein * 4, 0)}
            max={totalCalories * 1.8}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-4/6 justify-center"
          />
          <p className="text-center mt-2">
            Calories for {daysOfWeek[selectedDay]}: {sliderValue.toFixed(0)}
          </p>
          <p className="font-bold px-1 mt-6 text-center">
        Weekly Total Calories: {weeklyData.reduce((sum, day) => sum + day.Total, 0).toFixed(0)}
        </p>
        </div>
      )}
      <div className="flex justify-center space-x-4 mt-6 mb-8">
        <button 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl"
          onClick={resetChart}>Reset</button>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl flex items-center"
          onClick={copyToClipboard}>
          <Clipboard size={18} className="mr-2"/> Copy to Clipboard
        </button>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl flex items-center"
          onClick={shareToWhatsApp}>
          <Share2 size={18} className="mr-2"/> Share to WhatsApp
        </button>
      </div>
      <div className="flex justify-center mb-6">
      <a href="https://www.buymeacoffee.com/danielgonzalez">
        <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=danielgonzalez&button_colour=5F7FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" /></a>
      </div>
    </div>
  );
};


export default InteractiveWeeklyChart;