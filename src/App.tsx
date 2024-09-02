import { useState } from 'react';
import MacroInput from './MacroChoice';
import NoMacrosChoice from './NoMacrosChoice';
import InteractiveWeeklyChart from './WeeklyChart';
import TypingEffect from './components/TypingEffect';
import './index.css';

const App = () => {
  const [knowsMacros, setKnowsMacros] = useState<boolean | null>(null);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [totalCalories, setTotalCalories] = useState(0);
  const [showTypingEffect, _setShowTypingEffect] = useState(true);

  const handleMacrosSubmit = (submittedMacros: { protein: number; carbs: number; fats: number }) => {
    setMacros(submittedMacros);
    const total = submittedMacros.protein * 4 + submittedMacros.carbs * 4 + submittedMacros.fats * 9;
    setTotalCalories(total);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FFFFF0] ${knowsMacros === null ? 'justify-center' : 'pt-10'}`}>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-10">
          {showTypingEffect ? (
            <TypingEffect text="Calorie Banking" />
          ) : (
            "Calorie Banking"
          )}
        </h1>
        
        {knowsMacros === null ? (
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mt-10">
            <button 
              onClick={() => setKnowsMacros(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-2xl md:text-4xl animate-bounce"
            >
              I know my macros
            </button>
            <button 
              onClick={() => setKnowsMacros(false)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-2xl md:text-4xl animate-bounce"
            >
              I don't know my macros
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/2">
                {knowsMacros ? (
                  <MacroInput onSubmit={handleMacrosSubmit} />
                ) : (
                  <NoMacrosChoice onCalculate={handleMacrosSubmit} />
                )}
              </div>
              {totalCalories > 0 && (
                <div className="w-full md:w-1/2 p-4 border-2 border-blue-900 rounded-xl">
                  <h2 className="text-4xl font-semibold mb-4 text-center">Initial Macros</h2>
                  <div className="text-2xl space-y-2">
                    <p className="text-center">Protein: {macros.protein}g</p>
                    <p className="text-center">Carbs: {macros.carbs}g</p>
                    <p className="text-center">Fats: {macros.fats}g</p>
                    <p className="text-center font-bold">Total Calories: {totalCalories}</p>
                  </div>
                </div>
              )}
            </div>
            {totalCalories > 0 && (
              <div className="w-full mt-8">
                <InteractiveWeeklyChart initialMacros={macros} totalCalories={totalCalories} />
              </div>
            )}
          </div>
        )}
<footer className="w-full text-center py-5 bg-[#FFFFF0]">
        <p className="text-sm">
          Built by <a 
            href="https://www.instagram.com/lift_with_daniel/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Coach Daniel
          </a>
        </p>
      </footer>
      </div>
      
    </div>
  );
};

export default App;