import React from 'react';
import { fieldTypeMap } from './fields';
import { FieldContainer } from './styled/FormElements';
import withFieldMemoization from './fields/withFieldMemoization';

/**
 * Generic form field component that renders the appropriate field component
 * based on the field type.
 */
const FormField = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  loading = false,
  useDebouncing = false,
}) => {
  // Get the appropriate field component based on the field type
  const FieldComponent = fieldTypeMap[field.type];
  
  // If no matching component is found, show an error message
  if (!FieldComponent) {
    return (
      <FieldContainer>
        <div>Unsupported field type: {field.type}</div>
      </FieldContainer>
    );
  }
  
  // Render the field component with the provided props
  return (
    <FieldComponent
      field={field}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      disabled={disabled}
      loading={loading}
      useDebouncing={useDebouncing}
    />
  );
};

// Export the component wrapped with withFieldMemoization for consistent memoization
export default withFieldMemoization(FormField);
