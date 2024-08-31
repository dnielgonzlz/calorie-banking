import React, { useState, useEffect } from 'react';

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

interface Errors {
  age: string;
  height: string;
  weight: string;
}

const NoMacrosChoice: React.FC<NoMacrosChoiceProps> = ({ onCalculate }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    height: '',
    weight: '',
    sex: 'male',
    activityLevel: '1.2'
  });

  const [errors, setErrors] = useState<Errors>({
    age: '',
    height: '',
    weight: ''
  });

  const [bmr, setBmr] = useState<number>(0);
  const [proteinIntake, setProteinIntake] = useState<number>(1.3);
  const [carbFatSplit, setCarbFatSplit] = useState<number>(50);
  const [macros, setMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0 });

  const validateInput = (name: string, value: string): string => {
    if (value.trim() === '') return 'This field is required';
    if (!/^\d+$/.test(value)) return 'Only whole numbers are allowed';
    
    const numValue = parseInt(value);
    switch (name) {
      case 'age':
        return numValue < 18 ? 'Age must be 18 or above' : '';
      case 'height':
      case 'weight':
        return numValue <= 0 ? 'Value must be greater than 0' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
    
    if (['age', 'height', 'weight'].includes(name)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validateInput(name, value)
      }));
    }
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
    if (!errors.age && !errors.height && !errors.weight && 
        userInfo.age && userInfo.height && userInfo.weight) {
      const calculatedBmr = calculateBMR();
      setBmr(calculatedBmr);
    }
  }, [userInfo, errors]);

  useEffect(() => {
    if (bmr > 0) {
      const weight = parseFloat(userInfo.weight);
      const proteinCalories = weight * proteinIntake * 4;
      const remainingCalories = bmr - proteinCalories;
      const fatCalories = Math.max(remainingCalories * 0.2, remainingCalories * (1 - carbFatSplit / 100));
      const carbCalories = remainingCalories - fatCalories;

      const newMacros = {
        protein: Math.round(weight * proteinIntake),
        carbs: Math.round(carbCalories / 4),
        fats: Math.round(fatCalories / 9)
      };

      setMacros(newMacros);
      onCalculate(newMacros);
    }
  }, [bmr, proteinIntake, carbFatSplit, userInfo.weight]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border-blue-900 border-2 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Calculate Your Macros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { name: 'age', label: 'Age', type: 'number' },
          { name: 'height', label: 'Height (cm)', type: 'number' },
          { name: 'weight', label: 'Weight (kg)', type: 'number' },
        ].map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-2 text-lg font-semibold text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={userInfo[name as keyof typeof userInfo]}
              onChange={handleInputChange}
              className={`w-full p-2 border-2 ${errors[name as keyof Errors] ? 'border-red-500' : 'border-blue-950'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder={label}
            />
            {errors[name as keyof Errors] && (
              <span className="mt-1 text-xs text-red-500">{errors[name as keyof Errors]}</span>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 text-lg font-semibold text-gray-700 ">Sex</label>
          <select
            name="sex"
            value={userInfo.sex}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-lg font-semibold text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={userInfo.activityLevel}
            onChange={handleInputChange}
            className="w-full p-2 border-2 border-blue-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1.2">Less than 5,000 steps per day</option>
            <option value="1.375">10,000 to 14,999 steps per day</option>
            <option value="1.55">15,000 to 19,999 steps per day</option>
            <option value="1.725">20,000 to 24,999 steps per day</option>
            <option value="1.9">25,000 or more steps per day</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          Protein Intake (gr/kg of body weight): {proteinIntake.toFixed(1)}
        </label>
        <div className="relative h-6">
          <div className="absolute inset-y-0 w-full bg-gray-200 rounded-full"></div>
          <div 
            className="absolute inset-y-0 left-0 bg-[#7B0D1E] rounded-full" 
            style={{ width: `${((proteinIntake - 1.3) / (2.3 - 1.3)) * 100}%` }}
          ></div>
          <input
            type="range"
            min="1.3"
            max="2.3"
            step="0.1"
            value={proteinIntake}
            onChange={(e) => setProteinIntake(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 h-6 w-6 bg-white border-2 border-[#7B0D1E] rounded-full shadow"
            style={{ left: `calc(${((proteinIntake - 1.3) / (2.3 - 1.3)) * 100}% - 12px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1.3 g/kg</span>
          <span>2.3 g/kg</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          Carbs/Fats Split:
        </label>
        <div className="relative h-6">
          <div className="absolute inset-y-0 w-full bg-[#EAC435] rounded-full"></div>
          <div 
            className="absolute inset-y-0 left-0 bg-[#5B8C5A] rounded-full" 
            style={{ width: `${carbFatSplit * 100 / 80}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="80"
            value={carbFatSplit}
            onChange={(e) => setCarbFatSplit(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 h-6 w-6 bg-white border-2 border-[#5B8C5A] rounded-full shadow"
            style={{ left: `calc(${carbFatSplit * 100 / 80}% - 12px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{carbFatSplit}% Carbs</span>
        <span>{100 - carbFatSplit}% Fats</span>
        </div>
      </div>
    </div>
  );
};

export default NoMacrosChoice;