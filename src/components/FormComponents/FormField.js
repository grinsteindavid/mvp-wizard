import React, { useState } from 'react';
import { fieldTypeMap } from './fields';
import { FieldContainer, Label } from './styled/FormElements';
import withFieldMemoization from './fields/withFieldMemoization';
import RenderCounter from './RenderCounter';
import styled from 'styled-components';

// Enhanced field container with animations and hover effects
const EnhancedFieldContainer = styled(FieldContainer)`
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  
  &:hover {
    z-index: 1;
  }
  
  &:focus-within {
    z-index: 2;
  }
  
  ${props => props.isLoading && `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #4285f4;
      opacity: 0.7;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 0.3;
      }
    }
  `}
  
  /* Removed error top border as requested */
`;

const DescriptionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  font-size: 12px;
  margin-left: 4px;
  cursor: help;
  vertical-align: middle;
`;

const DescriptionTooltip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  color: #333;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 5;
`;

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
  const [showDescription, setShowDescription] = useState(false);

  const handleBlur = React.useCallback(() => {
    if (onBlur) {
      onBlur(field.name, value);
    }
  }, [field.name, value]);
  
  // If no matching component is found, show an error message
  if (!FieldComponent) {
    return (
      <EnhancedFieldContainer hasError={true}>
        <div
          data-testid="unsupported-field-error"
          style={{ padding: '12px', backgroundColor: '#ffebee', borderRadius: '6px', color: '#c62828' }}
        >
          Unsupported field type: <strong>{field.type}</strong>
        </div>
      </EnhancedFieldContainer>
    );
  }
  
  // Render the field component with the provided props
  // Determine whether to show the render counter
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShowCounter = isDevelopment && showRenderCounter;
  
  // Create the field component with all props
  const fieldComponent = (
    <EnhancedFieldContainer isLoading={loading} hasError={!!error}>
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="required-indicator"> *</span>}
        {field.description && (
          <DescriptionIcon
            title={field.description}
            onClick={() => setShowDescription(!showDescription)}
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
          >
            ?
          </DescriptionIcon>
        )}
      </Label>
      
      {showDescription && field.description && (
        <DescriptionTooltip>
          {field.description}
        </DescriptionTooltip>
      )}
      <FieldComponent
        field={field}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        error={error}
        disabled={disabled}
        loading={loading}
        useDebouncing={useDebouncing}
      />
    </EnhancedFieldContainer>
  );
  
  // Wrap with render counter if enabled
  return shouldShowCounter ? (
    <RenderCounter>{fieldComponent}</RenderCounter>
  ) : fieldComponent;
};

// Export the component wrapped with withFieldMemoization for consistent memoization
export default withFieldMemoization(FormField);
