import React, { useState, useCallback } from 'react';

// Constants
const MACRO_TYPES = {
  protein: { label: 'Protein', multiplier: 4, unit: 'grams' },
  fats: { label: 'Fats', multiplier: 9, unit: 'grams' },
  carbs: { label: 'Carbs', multiplier: 4, unit: 'grams' }
} as const;

const VALIDATION_MESSAGES = {
  required: 'This field is required',
  invalidFormat: 'Only positive whole numbers are allowed',
  invalidValue: 'Value must be greater than 0'
} as const;

// Types
type MacroType = keyof typeof MACRO_TYPES;
type MacroValues = Record<MacroType, string>;
type MacroErrors = Partial<Record<MacroType, string>>;
type NumericMacros = Record<MacroType, number>;

interface MacroInputProps {
  onSubmit: (macros: NumericMacros) => void;
}

// Custom hook for validation
const useValidation = () => {
  const validateInput = useCallback((value: string): string => {
    if (value.trim() === '') return VALIDATION_MESSAGES.required;
    if (!/^\d+$/.test(value)) return VALIDATION_MESSAGES.invalidFormat;
    if (parseInt(value) <= 0) return VALIDATION_MESSAGES.invalidValue;
    return '';
  }, []);

  const validateAllInputs = useCallback((macros: MacroValues): MacroErrors => {
    const errors: MacroErrors = {};
    
    (Object.keys(MACRO_TYPES) as MacroType[]).forEach(key => {
      const error = validateInput(macros[key]);
      if (error) errors[key] = error;
    });
    
    return errors;
  }, [validateInput]);

  return { validateAllInputs };
};

// Utility functions
const calculateCalories = (grams: string, multiplier: number): string => {
  const parsedGrams = parseInt(grams) || 0;
  return (parsedGrams * multiplier).toFixed(0);
};

const convertToNumericMacros = (macros: MacroValues): NumericMacros => {
  return (Object.keys(MACRO_TYPES) as MacroType[]).reduce((acc, key) => {
    acc[key] = parseInt(macros[key]);
    return acc;
  }, {} as NumericMacros);
};

// Main component
const MacroInput: React.FC<MacroInputProps> = ({ onSubmit }) => {
  const [macros, setMacros] = useState<MacroValues>({
    protein: '',
    fats: '',
    carbs: ''
  });

  const [errors, setErrors] = useState<MacroErrors>({});
  const { validateAllInputs } = useValidation();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const macroType = name as MacroType;
    
    setMacros(prevMacros => ({
      ...prevMacros,
      [macroType]: value
    }));
    
    // Clear error when user starts typing
    if (errors[macroType]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[macroType];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(() => {
    const validationErrors = validateAllInputs(macros);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const numericMacros = convertToNumericMacros(macros);
    onSubmit(numericMacros);
  }, [macros, validateAllInputs, onSubmit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 border-2 border-blue-900 rounded-xl bg-white shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Enter Your Macros
      </h2>
      
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(MACRO_TYPES) as [MacroType, typeof MACRO_TYPES[MacroType]][]).map(
            ([key, config]) => (
              <div key={key} className="flex flex-col space-y-2">
                <label 
                  htmlFor={key}
                  className="text-lg font-semibold text-gray-700"
                >
                  {config.label} ({config.unit}):
                </label>
                
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={macros[key]}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`
                    w-full h-12 px-4 py-2 text-lg border-2 rounded-xl
                    transition-all duration-200 focus:outline-none focus:ring-2
                    ${errors[key] 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                      : 'border-blue-950 focus:border-blue-500 focus:ring-blue-200'
                    }
                  `}
                  placeholder="0"
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : `${key}-calories`}
                />
                
                {errors[key] && (
                  <span 
                    id={`${key}-error`}
                    className="text-sm text-red-500 font-medium"
                    role="alert"
                  >
                    {errors[key]}
                  </span>
                )}
                
                <span 
                  id={`${key}-calories`}
                  className="text-sm text-gray-600"
                >
                  {calculateCalories(macros[key], config.multiplier)} calories
                </span>
              </div>
            )
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button 
            type="submit"
            className="
              bg-blue-950 hover:bg-blue-800 active:bg-blue-900
              text-white font-bold py-3 px-8 rounded-xl
              transition-colors duration-200 text-lg
              focus:outline-none focus:ring-2 focus:ring-blue-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Submit Macros
          </button> 
        </div>
      </form>
    </div>
  );
};

export default MacroInput;