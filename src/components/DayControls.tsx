import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DailyData } from '../shared/types/chart';

interface DayControlsProps {
  weeklyData: DailyData[];
  onToggleDayBlock: (index: number) => void;
}

/**
 * Controls for locking/unlocking individual days
 */
export const DayControls: React.FC<DayControlsProps> = ({ weeklyData, onToggleDayBlock }) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="w-full max-w-4xl flex justify-between px-0 sm:px-2 md:px-4">
        {weeklyData.map((day, index) => (
          <div key={day.name} className="flex flex-col items-center">
            <button 
              onClick={() => onToggleDayBlock(index)}
              className="mb-2 p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={`${day.isBlocked ? 'Unlock' : 'Lock'} ${day.name}`}
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
  );
}; 