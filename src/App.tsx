import { useState } from 'react';
import './App.css'
import MacroInput from '../MacroChoice';
import NoMacrosChoice from '../NoMacrosChoice';
import InteractiveWeeklyChart from '../WeeklyChart';

// TODO: Create "lock mode" for days, so that the caloric adjustment doesn't happen when the day is locked
// TODO: Share button with text like if it was going to be shared to a coach
// TODO: Optimise for mobiles
// TODO: Read MyfitnessPal API to study the possibility of sending this to my fitness pal
// TODO: Add a button that says "Buy me a coffee!"

function App() {
  const [knowsMacros, setKnowsMacros] = useState<boolean | null>(null);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [totalCalories, setTotalCalories] = useState(0);

  const UserMacros = () => (
    <div className="user-macros">
      <h2>Do you know your macros?</h2>
      <button onClick={() => setKnowsMacros(true)}>I know my macros</button>
      <button onClick={() => setKnowsMacros(false)}>I don't know my macros</button>
    </div>
  );

  const handleMacrosSubmit = (submittedMacros: { protein: number, carbs: number, fats: number }) => {
    setMacros(submittedMacros);
    const total = submittedMacros.protein * 4 + submittedMacros.carbs * 4 + submittedMacros.fats * 9;
    setTotalCalories(total);
    console.log('Macros submitted:', submittedMacros);
    console.log('Total calories calculated:', total);
  };

  return (
    <div className="App">
      <h1>Calorie Banking 💸</h1>
      {knowsMacros === null ? (
        <UserMacros />
      ) : knowsMacros ? (
        <>
          <MacroInput onSubmit={handleMacrosSubmit} />
          {totalCalories > 0 && (
            <>
              <h2>Initial Macros:</h2>
              <p>Protein: {macros.protein}g</p>
              <p>Carbs: {macros.carbs}g</p>
              <p>Fats: {macros.fats}g</p>
              <p>Total Calories: {totalCalories}</p>
              <InteractiveWeeklyChart initialMacros={macros} totalCalories={totalCalories} />
            </>
          )}
        </>
      ) : (
        <>
          <NoMacrosChoice onCalculate={handleMacrosSubmit} />
          {totalCalories > 0 && (
            <>
              <h2>Initial Macros:</h2>
              <p>Protein: {macros.protein}g</p>
              <p>Carbs: {macros.carbs}g</p>
              <p>Fats: {macros.fats}g</p>
              <p>Total Calories: {totalCalories}</p>
              <InteractiveWeeklyChart initialMacros={macros} totalCalories={totalCalories} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;