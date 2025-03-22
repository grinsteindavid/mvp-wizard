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
      {loading ? (
        <>
          <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '8px' }}>Loading options...</div>
          <Select
            id={field.name}
            name={field.name}
            multiple
            value={Array.isArray(value) ? value : []}
            disabled={true}
            hasError={!!error}
            size={field.size || 5}
            data-loading={loading}
            style={{ opacity: 0.7, cursor: 'wait' }}
          >
            <option disabled>Loading options...</option>
          </Select>
        </>
      ) : (
        <Select
          id={field.name}
          name={field.name}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={handleChange}
          disabled={disabled}
          hasError={!!error}
          size={field.size || 5}
        >
          {field.options && field.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {field.helpText && <HelpText>{field.helpText}</HelpText>}
    </FieldContainer>
  );
};

export default MultiSelectField;
