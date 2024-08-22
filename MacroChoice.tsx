import {useState} from 'react';
import './src/App.css';

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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow numeric input (including decimal point)
    if (/^\d*$/.test(value)) {
      setMacros(prevMacros => ({
        ...prevMacros,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    const numericMacros: NumericMacros = {
      protein: parseFloat(macros.protein) || 0,
      fats: parseFloat(macros.fats) || 0,
      carbs: parseFloat(macros.carbs) || 0
    };
    onSubmit(numericMacros);
  };

  const calculateCalories = (grams: string, multiplier: number): string => {
    const parsedGrams = parseFloat(grams) || 0;
    return (parsedGrams * multiplier).toFixed(1);
  };

  return (
    <div className="macro-input">
      <h2>Enter Your Macros</h2>
      <div className="macro-inputs">
        {[
          { key: 'protein', label: 'Protein', multiplier: 4 },
          { key: 'fats', label: 'Fats', multiplier: 9 },
          { key: 'carbs', label: 'Carbs', multiplier: 4 }
        ].map(({ key, label, multiplier }) => (
          <div key={key} className="input-group">
            <label>{label} (grams):</label>
            <input
              type="text"
              name={key}
              value={macros[key as keyof Macros]}
              onChange={handleInputChange}
              className="numeric-input"
            />
            <span>{calculateCalories(macros[key as keyof Macros], multiplier)} calories</span>
            <button onClick={handleSubmit}>Submit Macros</button>
          </div>
        ))}
      </div>
    </div>
  );

};

export default MacroInput;

