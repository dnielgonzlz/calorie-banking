import { useCallback, useState } from 'react';
import { VALIDATION_MESSAGES } from '../../domain/nutrition/constants';
import { ValidationErrors } from '../../domain/nutrition/models';

export const useFormValidation = () => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateInput = useCallback((name: string, value: string): string => {
    if (value.trim() === '') return VALIDATION_MESSAGES.REQUIRED;
    if (!/^\d+$/.test(value)) return VALIDATION_MESSAGES.INVALID_FORMAT;
    
    const numValue = parseInt(value);
    switch (name) {
      case 'age':
        return numValue < 18 ? VALIDATION_MESSAGES.INVALID_AGE : '';
      case 'height':
      case 'weight':
        return numValue <= 0 ? VALIDATION_MESSAGES.INVALID_VALUE : '';
      default:
        return '';
    }
  }, []);

  const validateAllInputs = useCallback((userInfo: {
    age: string;
    height: string;
    weight: string;
  }): ValidationErrors => {
    return {
      age: touchedFields.has('age') ? validateInput('age', userInfo.age) : '',
      height: touchedFields.has('height') ? validateInput('height', userInfo.height) : '',
      weight: touchedFields.has('weight') ? validateInput('weight', userInfo.weight) : '',
    };
  }, [validateInput, touchedFields]);

  const validateAllInputsForSubmit = useCallback((userInfo: {
    age: string;
    height: string;
    weight: string;
  }): ValidationErrors => {
    return {
      age: validateInput('age', userInfo.age),
      height: validateInput('height', userInfo.height),
      weight: validateInput('weight', userInfo.weight),
    };
  }, [validateInput]);

  const hasErrors = useCallback((errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== '');
  }, []);

  const markFieldAsTouched = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  }, []);

  const resetTouchedFields = useCallback(() => {
    setTouchedFields(new Set());
  }, []);

  return {
    validateInput,
    validateAllInputs,
    validateAllInputsForSubmit,
    hasErrors,
    markFieldAsTouched,
    resetTouchedFields,
  };
}; 