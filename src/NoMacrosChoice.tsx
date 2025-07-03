import React, { useState, useCallback } from 'react';
import { UserInfo, Macros } from './domain/nutrition/models';
import { ACTIVITY_LEVELS, PROTEIN_RANGE, CARB_FAT_SPLIT_RANGE } from './domain/nutrition/constants';
import { useMacroCalculation } from './application/hooks/useMacroCalculation';
import { useFormValidation } from './application/hooks/useFormValidation';
import { FormInput } from './components/ui/form-input';
import { FormSelect } from './components/ui/form-select';
import { RangeSlider } from './components/ui/range-slider';

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

  const [proteinIntake, setProteinIntake] = useState<number>(1.3);
  const [carbFatSplit, setCarbFatSplit] = useState<number>(50);

  const { markFieldAsTouched } = useFormValidation();

  // Memoize the onCalculate callback to prevent infinite loops
  const memoizedOnCalculate = useCallback(onCalculate, [onCalculate]);

  const { validationErrors } = useMacroCalculation({
    userInfo,
    proteinIntake,
    carbFatSplit,
    onCalculate: memoizedOnCalculate,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    markFieldAsTouched(name);
  }, [markFieldAsTouched]);

  const handleProteinIntakeChange = useCallback((value: number) => {
    setProteinIntake(value);
  }, []);

  const handleCarbFatSplitChange = useCallback((value: number) => {
    setCarbFatSplit(value);
  }, []);

  // Form field configurations
  const formFields = [
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'height', label: 'Height (cm)', type: 'number' },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
  ] as const;

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border-blue-900 border-2 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Calculate Your Macros</h2>
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {formFields.map(({ name, label, type }) => (
          <FormInput
            key={name}
            name={name}
            label={label}
            type={type}
            value={userInfo[name as keyof typeof userInfo]}
            error={validationErrors[name as keyof typeof validationErrors]}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        ))}
      </div>

      {/* Sex and Activity Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormSelect
          name="sex"
          label="Sex"
          value={userInfo.sex}
          options={sexOptions}
          onChange={handleInputChange}
        />
        <FormSelect
          name="activityLevel"
          label="Activity Level"
          value={userInfo.activityLevel}
          options={ACTIVITY_LEVELS}
          onChange={handleInputChange}
        />
      </div>

      {/* Protein Intake Slider */}
      <RangeSlider
        name="proteinIntake"
        label="Protein Intake (gr/kg of body weight)"
        value={proteinIntake}
        min={PROTEIN_RANGE.MIN}
        max={PROTEIN_RANGE.MAX}
        step={PROTEIN_RANGE.STEP}
        unit=" g/kg"
        color="#7B0D1E"
        backgroundColor="#f3f4f6"
        formatValue={(value) => value.toFixed(1)}
        minLabel="1.3 g/kg"
        maxLabel="2.3 g/kg"
        onChange={handleProteinIntakeChange}
      />

      {/* Carbs/Fats Split Slider */}
      <RangeSlider
        name="carbFatSplit"
        label="Carbs/Fats Split"
        value={carbFatSplit}
        min={CARB_FAT_SPLIT_RANGE.MIN}
        max={CARB_FAT_SPLIT_RANGE.MAX}
        step={CARB_FAT_SPLIT_RANGE.STEP}
        color="#5B8C5A"
        backgroundColor="#EAC435"
        formatValue={(value) => `${value}% Carbs / ${100 - value}% Fats`}
        minLabel={`${CARB_FAT_SPLIT_RANGE.MIN}% Carbs`}
        maxLabel={`${CARB_FAT_SPLIT_RANGE.MAX}% Carbs`}
        onChange={handleCarbFatSplitChange}
      />
    </div>
  );
};

export default NoMacrosChoice;