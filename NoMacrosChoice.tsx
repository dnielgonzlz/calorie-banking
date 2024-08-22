import { useState, useEffect } from 'react';
import './src/App.css';

interface UserInfo {
    age: string;
    height: string;
    weight: string;
    sex: 'male' | 'female';
    activityLevel: string;
  }
  
  interface Macros {
    protein: number;
    carbs: number;
    fats: number;
  }

  interface NoMacrosChoiceProps {
    onCalculate: (macros: Macros) => void;
  }

  const NoMacrosChoice: React.FC<NoMacrosChoiceProps> = ({ onCalculate }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    height: '',
    weight: '',
    sex: 'male',
    activityLevel: '1.2'
  });

  const [bmr, setBmr] = useState<number>(0);
  const [proteinIntake, setProteinIntake] = useState<number>(1.3);
  const [carbFatSplit, setCarbFatSplit] = useState<number>(50);
  const [macros, setMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0 });

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
};

const calculateBMR = (): number => {
    const { age, height, weight, sex, activityLevel } = userInfo;
    let calculatedBmr: number;

    if (sex === 'male') {
      calculatedBmr = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
    } else {
      calculatedBmr = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
    }

    return calculatedBmr * parseFloat(activityLevel);
  };

  useEffect(() => {
    const calculatedBmr = calculateBMR();
    setBmr(calculatedBmr);
  }, [userInfo]);

  useEffect(() => {
    const weight = parseFloat(userInfo.weight);
    const proteinCalories = weight * proteinIntake * 4;
    const remainingCalories = bmr - proteinCalories;
    const fatCalories = Math.max(remainingCalories * 0.2, remainingCalories * (1 - carbFatSplit / 100));
    const carbCalories = remainingCalories - fatCalories;

    setMacros({
      protein: Math.round(weight * proteinIntake),
      carbs: Math.round(carbCalories / 4),
      fats: Math.round(fatCalories / 9)
    });

    onCalculate(macros);
  }, [bmr, proteinIntake, carbFatSplit, userInfo.weight]);

  return (
    <div className="no-macros-choice">
      <h2>Calculate Your Macros</h2>
      
      <div className="input-section">
        <input type="number" name="age" value={userInfo.age} onChange={handleInputChange} placeholder="Age" />
        <input type="number" name="height" value={userInfo.height} onChange={handleInputChange} placeholder="Height (cm)" />
        <input type="number" name="weight" value={userInfo.weight} onChange={handleInputChange} placeholder="Weight (kg)" />
        
        <select name="sex" value={userInfo.sex} onChange={handleInputChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        
        <select name="activityLevel" value={userInfo.activityLevel} onChange={handleInputChange}>
          <option value="1.2">No exercise</option>
          <option value="1.375">Light exercise (1-3 times per week)</option>
          <option value="1.55">Moderate exercise (3-5 times per week)</option>
          <option value="1.725">Heavy exercise (6-7 days per week)</option>
          <option value="1.9">Very heavy exercise</option>
        </select>
      </div>

      <div className="results-section">
        <p>Your Basal Metabolic Rate: {Math.round(bmr)} calories/day</p>
        
        <div className="slider-section">
          <label>Protein Intake (g/kg of body weight): {proteinIntake.toFixed(1)}</label>
          <input 
            type="range" 
            min="1.3" 
            max="2.3" 
            step="0.1" 
            value={proteinIntake} 
            onChange={(e) => setProteinIntake(parseFloat(e.target.value))} 
          />
        </div>

        <div className="slider-section">
          <label>Carbs/Fats Split: {carbFatSplit}% Carbs / {100 - carbFatSplit}% Fats</label>
          <input 
            type="range" 
            min="0" 
            max="80" 
            value={carbFatSplit} 
            onChange={(e) => setCarbFatSplit(parseInt(e.target.value))} 
          />
        </div>

        <div className="macros-result">
          <h3>Your Calculated Macros:</h3>
          <p>Protein: {macros.protein}g ({(macros.protein * 4).toFixed(0)} calories)</p>
          <p>Carbs: {macros.carbs}g ({(macros.carbs * 4).toFixed(0)} calories)</p>
          <p>Fats: {macros.fats}g ({(macros.fats * 9).toFixed(0)} calories)</p>
          <p>Total Calories: {((macros.protein * 4) + (macros.carbs * 4) + (macros.fats * 9)).toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};

export default NoMacrosChoice;