import React from 'react';
import { FieldContainer, Label, RadioButton, OptionLabel, ErrorMessage, HelpText } from '../styled/FormElements';

const RadioField = ({ 
  field, 
  value, 
  onChange, 
  error, 
  disabled = false,
  loading = false
}) => {
  const handleChange = (optionValue) => {
    onChange(field.name, optionValue);
  };

  return (
    <FieldContainer>
      <Label>{field.label}</Label>
      {loading ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>Loading options...</div>
      ) : (
        field.options && field.options.map(option => (
          <OptionLabel 
            key={option.value}
            style={loading ? { opacity: 0.7, cursor: 'wait' } : {}}
          >
            <RadioButton
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || loading}
              data-loading={loading}
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

export default RadioField;
