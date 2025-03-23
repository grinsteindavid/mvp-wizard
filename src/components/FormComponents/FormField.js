import React from 'react';
import { fieldTypeMap } from './fields';
import { FieldContainer } from './styled/FormElements';
import withFieldMemoization from './fields/withFieldMemoization';
import RenderCounter from './RenderCounter';

/**
 * Generic form field component that renders the appropriate field component
 * based on the field type.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration object
 * @param {any} props.value - Current field value
 * @param {function} props.onChange - Change handler function
 * @param {function} props.onBlur - Blur handler function
 * @param {string} props.error - Error message if any
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {boolean} props.loading - Whether the field is in loading state
 * @param {boolean} props.useDebouncing - Whether to use debouncing for changes
 * @param {boolean} props.showRenderCounter - Whether to show render counter (defaults to true in dev)
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
  showRenderCounter = true,
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
  // Determine whether to show the render counter
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShowCounter = isDevelopment && showRenderCounter;
  
  // Create the field component with all props
  const fieldComponent = (
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
  
  // Wrap with render counter if enabled
  return shouldShowCounter ? (
    <RenderCounter>{fieldComponent}</RenderCounter>
  ) : fieldComponent;
};

// Export the component wrapped with withFieldMemoization for consistent memoization
export default withFieldMemoization(FormField);
