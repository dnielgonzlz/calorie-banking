import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserInfo, Macros } from '../../domain/nutrition/models';
import { calculateBMR, calculateMacros } from '../../domain/nutrition/calculators';
import { useFormValidation } from './useFormValidation';

interface UseMacroCalculationProps {
  userInfo: UserInfo;
  proteinIntake: number;
  carbFatSplit: number;
  onCalculate: (macros: Macros) => void;
}

export const useMacroCalculation = ({
  userInfo,
  proteinIntake,
  carbFatSplit,
  onCalculate,
}: UseMacroCalculationProps) => {
  const [bmr, setBmr] = useState<number>(0);
  const { validateAllInputs, validateAllInputsForSubmit, hasErrors } = useFormValidation();

  // Memoize the onCalculate callback to prevent infinite loops
  const memoizedOnCalculate = useCallback(onCalculate, []);

  // Validate user inputs (only show errors for touched fields)
  const validationErrors = useMemo(() => {
    return validateAllInputs(userInfo);
  }, [userInfo, validateAllInputs]);

  // Check if all required fields are filled and valid (for calculation purposes)
  const isFormValid = useMemo(() => {
    const allFieldsErrors = validateAllInputsForSubmit(userInfo);
    return !hasErrors(allFieldsErrors) && 
           userInfo.age && 
           userInfo.height && 
           userInfo.weight;
  }, [userInfo, validateAllInputsForSubmit, hasErrors]);

  // Calculate BMR when form is valid
  useEffect(() => {
    if (isFormValid) {
      const calculatedBmr = calculateBMR(userInfo);
      setBmr(calculatedBmr);
    } else {
      setBmr(0);
    }
  }, [userInfo, isFormValid]);

  // Calculate and emit macros when BMR or preferences change
  useEffect(() => {
    if (bmr > 0) {
      const weight = parseFloat(userInfo.weight);
      const macros = calculateMacros(bmr, weight, proteinIntake, carbFatSplit);
      memoizedOnCalculate(macros);
    }
  }, [bmr, proteinIntake, carbFatSplit, userInfo.weight, memoizedOnCalculate]);

  return {
    bmr,
    validationErrors,
    isFormValid,
  };
}; 