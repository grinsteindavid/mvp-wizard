import React from 'react';
import { Select } from '../styled/FormElements';
import withFieldMemoization from './withFieldMemoization';
import useFieldChangeHandler from '../hooks/useFieldChangeHandler';
import BaseField from './BaseField';

const SelectField = ({ 
  field, 
  value, 
  onChange, 
  error, 
  disabled = false,
  loading = false
}) => {
  const handleChange = useFieldChangeHandler(field.name, onChange);

  return (
    <BaseField field={field} error={error}>
      <Select
        id={field.name}
        name={field.name}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading}
        hasError={!!error}
        data-loading={loading}
        style={loading ? { opacity: 0.7, cursor: 'wait' } : {}}
      >
        <option value="">
          {loading ? 'Loading...' : `Select ${field.label}`}
        </option>
        {!loading && field.options && field.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </BaseField>
  );
};

// Apply the memoization HOC to the component
export default withFieldMemoization(SelectField);
