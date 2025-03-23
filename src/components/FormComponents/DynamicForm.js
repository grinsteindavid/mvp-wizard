import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormGroup from './FormGroup';
import ArrayField from './ArrayField';
import { FormContainer } from './styled/FormElements';
import { get } from 'lodash';

/**
 * DynamicForm component that renders a form based on a configuration object.
 * Supports different field types including groups and arrays.
 * Now with field-level validation using the validateField function from field definitions.
 * Also supports loading state for fields.
 */
const DynamicForm = ({ fields, values, onChange, errors, onValidate, loadingFields = {} }) => {
  // Local state for field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Combine passed errors with local field validation errors
  const combinedErrors = { ...fieldErrors, ...errors };

  // Validate a single field
  const validateSingleField = (name, value) => {
    const field = fields[name];
    
    // Skip validation if the field doesn't have a validateField function
    if (!field || !field.validateField) return;
    
    // Call the field's validateField function
    const validationResult = field.validateField(value, values);
    
    // Update the local field errors
    setFieldErrors(prev => ({
      ...prev,
      [name]: validationResult.isValid ? undefined : validationResult.error
    }));
    
    // If onValidate prop exists, call it with the validation result
    if (onValidate) {
      onValidate(name, validationResult);
    }
    
    return validationResult;
  };

  const handleFieldChange = (name, value) => {
    // Update the form values
    onChange(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Validate the field after a short delay to allow for typing
    setTimeout(() => {
      validateSingleField(name, value);
    }, 300);
  };

  // Validate all fields when values change significantly
  useEffect(() => {
    // Skip validation on initial render or when values is undefined
    if (!values) return;
    
    // Clear field errors when values change significantly
    setFieldErrors({});
  }, [values]);

  if (!fields) {
    return <div>No form fields available</div>;
  }

  return (
    <FormContainer>
      {Object.entries(fields).map(([fieldName, fieldConfig]) => {
        // Create a field object that components can use
        const field = {
          ...fieldConfig,
          name: fieldName
        };
        
        // Get the current value for this field
        const fieldValue = values ? values[fieldName] : undefined;
        
        // Get any error for this field from combined errors
        const fieldError = combinedErrors ? combinedErrors[fieldName] : undefined;
        
        // Handle blur event for validation
        const handleBlur = () => {
          if (field.validateField) {
            validateSingleField(fieldName, fieldValue);
          }
        };
        
        // Render the appropriate component based on field type
        switch (field.type) {
          case 'group':
            return (
              <FormGroup
                key={fieldName}
                field={field}
                values={fieldValue}
                onChange={handleFieldChange}
                errors={combinedErrors}
                loadingFields={loadingFields}
              />
            );
          case 'array':
            return (
              <ArrayField
                key={fieldName}
                field={field}
                value={fieldValue}
                onChange={handleFieldChange}
                errors={combinedErrors}
                loadingFields={loadingFields}
              />
            );
          default:
            return (
              <FormField
                key={fieldName}
                field={field}
                value={fieldValue}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={fieldError}
                loading={get(loadingFields, fieldName)}
              />
            );
        }
      })}
    </FormContainer>
  );
};

export default DynamicForm;
