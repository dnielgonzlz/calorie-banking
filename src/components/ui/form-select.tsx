import React from 'react';

interface FormSelectProps {
  name: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label 
        htmlFor={name}
        className="mb-2 text-lg font-semibold text-gray-700"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border-2 border-blue-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 