import React from 'react';

interface FormInputProps {
  name: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  value,
  error,
  placeholder,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex flex-col">
      <label 
        htmlFor={name}
        className="mb-2 text-lg font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full p-2 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-blue-950'}
        `}
        placeholder={placeholder || label}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span 
          id={`${name}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}; 