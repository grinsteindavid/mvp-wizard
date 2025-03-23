import React, { useEffect, useState } from 'react';
import { Input } from '../styled/FormElements';
import withFieldMemoization from './withFieldMemoization';
import BaseField from './BaseField';
import useDebounce from '../hooks/useDebounce';


const TextField = ({ 
  field, 
  value, 
  onChange, 
  onBlur,
  error, 
  disabled = false,
  debounceDelay = 500, // Default debounce delay
  useDebouncing = false // Disable debouncing by default to maintain compatibility with existing tests
}) => {
  // Track the current input value for immediate display
  const [inputValue, setInputValue] = useState(value || '');
  
  // Use the debounce hook for the debounced value
  const [debouncedValue, setDebouncedValue, isDebouncing] = useDebounce(inputValue, debounceDelay);
  
  // Update local input value when value prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  
  // Handle input changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setDebouncedValue(newValue);
    
    // If debouncing is disabled, call onChange immediately
    // This maintains compatibility with existing tests
    if (!useDebouncing) {
      onChange(field.name, newValue);
    }
  };
  
  // Effect to call the onChange prop when the debounced value changes
  useEffect(() => {
    // Only call onChange if debouncing is enabled and debouncedValue is different from the current value
    if (useDebouncing && debouncedValue !== value && debouncedValue !== '') {
      onChange(field.name, debouncedValue);
    }
  }, [debouncedValue, field.name, onChange, value, useDebouncing]);

  return (
    <BaseField field={field} error={error}>
      <Input
        type={field.type || 'text'}
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={field.placeholder || ''}
        min={field.validation?.min}
        max={field.validation?.max}
        step={field.validation?.step}
        disabled={disabled}
        hasError={!!error}
        data-debouncing={useDebouncing && isDebouncing}
      />
    </BaseField>
  );
};

// Apply the memoization HOC to the component
export default withFieldMemoization(TextField);
