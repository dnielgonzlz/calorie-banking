import React, { useState } from 'react';

interface Macros {
  protein: string;
  fats: string;
  carbs: string;
}

interface NumericMacros {
  protein: number;
  fats: number;
  carbs: number;
}

interface MacroInputProps {
  onSubmit: (macros: NumericMacros) => void;
}

const MacroInput: React.FC<MacroInputProps> = ({ onSubmit }) => {
  const [macros, setMacros] = useState<Macros>({
    protein: '',
    fats: '',
    carbs: ''
  });

  const [errors, setErrors] = useState<Macros>({
    protein: '',
    fats: '',
    carbs: ''
  });

  const validateInput = (value: string): string => {
    if (value.trim() === '') return 'This field is required';
    if (!/^\d+$/.test(value)) return 'Only positive whole numbers are allowed';
    if (parseInt(value) <= 0) return 'Value must be greater than 0';
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMacros(prevMacros => ({
      ...prevMacros,
      [name]: value
    }));
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validateInput(value)
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      protein: validateInput(macros.protein),
      fats: validateInput(macros.fats),
      carbs: validateInput(macros.carbs)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every(error => error === '')) {
      const numericMacros: NumericMacros = {
        protein: parseInt(macros.protein),
        fats: parseInt(macros.fats),
        carbs: parseInt(macros.carbs)
      };
      onSubmit(numericMacros);
    }
  };

  const calculateCalories = (grams: string, multiplier: number): string => {
    const parsedGrams = parseInt(grams) || 0;
    return (parsedGrams * multiplier).toFixed(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border-blue-900 border-2 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Enter Your Macros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {[
          { key: 'protein', label: 'Protein', multiplier: 4 },
          { key: 'fats', label: 'Fats', multiplier: 9 },
          { key: 'carbs', label: 'Carbs', multiplier: 4 }
        ].map(({ key, label, multiplier }) => (
          <div key={key} className="flex flex-col">
            <label className="mb-2 text-lg font-semibold text-gray-700">{label} (grams):</label>
            <input
              type="text"
              name={key}
              value={macros[key as keyof Macros]}
              onChange={handleInputChange}
              className={`w-24 h-12 p-3 border-2 ${errors[key as keyof Macros] ? 'border-red-500' : 'border-blue-950'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg`}
              placeholder=""
            />
            {errors[key as keyof Macros] && (
              <span className="mt-1 text-xs text-red-500">{errors[key as keyof Macros]}</span>
            )}
            <span className="mt-2 text-sm text-gray-600">{calculateCalories(macros[key as keyof Macros], multiplier)} calories</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button 
          onClick={handleSubmit}
          className="bg-blue-950 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-lg"
        >
          Submit Macros
        </button>
      </div>
    </div>
  );
};

export default MacroInput;