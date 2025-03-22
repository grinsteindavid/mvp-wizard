import React from 'react';
import { FieldContainer, Label, Select, ErrorMessage, HelpText } from '../styled/FormElements';

const MultiSelectField = ({ 
  field, 
  value, 
  onChange, 
  error, 
  disabled = false,
  loading = false
}) => {
  const handleChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    onChange(field.name, values);
  };

  return (
    <FieldContainer>
      <Label htmlFor={field.name}>{field.label}</Label>
      <Select
        id={field.name}
        name={field.name}
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={handleChange}
        disabled={disabled || loading}
        hasError={!!error}
        size={field.size || 5}
        data-loading={loading}
        style={loading ? { opacity: 0.7, cursor: 'wait' } : {}}
      >
        {loading && (
          <option disabled>Loading options...</option>
        )}
        {!loading && field.options && field.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {field.helpText && <HelpText>{field.helpText}</HelpText>}
    </FieldContainer>
  );
};

export default MultiSelectField;
