import React from 'react';
import { FieldContainer, Label, Checkbox, OptionLabel, ErrorMessage, HelpText } from '../styled/FormElements';

const CheckboxesField = ({ 
  field, 
  value, 
  onChange, 
  error, 
  disabled = false,
  loading = false
}) => {
  const handleChange = (optionValue, checked) => {
    const currentValues = Array.isArray(value) ? [...value] : [];
    
    if (checked) {
      // Add the value if it's not already in the array
      if (!currentValues.includes(optionValue)) {
        currentValues.push(optionValue);
      }
    } else {
      // Remove the value if it's in the array
      const index = currentValues.indexOf(optionValue);
      if (index !== -1) {
        currentValues.splice(index, 1);
      }
    }
    
    onChange(field.name, currentValues);
  };

  const values = Array.isArray(value) ? value : [];
  

  return (
    <FieldContainer>
      <Label>{field.label}</Label>
      {loading ? (
        <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '8px', padding: '4px 0' }}>
          Loading options...
        </div>
      ) : (
        field.options && field.options.map(option => (
          <OptionLabel 
            key={option.value}
          >
            <Checkbox
              name={`${field.name}[${option.value}]`}
              checked={values.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled}
            />
            {option.label}
          </OptionLabel>
        ))
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {field.helpText && <HelpText>{field.helpText}</HelpText>}
    </FieldContainer>
  );
};

export default CheckboxesField;
