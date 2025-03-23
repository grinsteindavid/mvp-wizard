import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormGroup from './FormGroup';
import ArrayField from './ArrayField';
import { FormContainer } from './styled/FormElements';
import { validateField } from '../../services/validationService';

/**
 * DynamicForm component that renders a form based on a configuration object.
 * Supports different field types including groups and arrays.
 * Now with field-level validation using the validateField function from validationService.
 * Also supports loading state from field definitions.
 * Updated to work with field values and loading states stored within field definitions.
 * Accepts a validationSchema prop for centralized validation.
 */
const DynamicForm = ({ fields, onChange, errors, onValidate, validationSchema }) => {
  // Local state for field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Combine passed errors with local field validation errors
  const combinedErrors = { ...fieldErrors, ...errors };

  // Validate a single field
  const validateSingleField = (name, value) => {
    const field = fields[name];
    
    // Skip validation if no field or no validation schema
    if (!field || !validationSchema) return;
    
    // Call the validateField function from validationService
    const validationResult = validateField(validationSchema, name, value);
    
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
    // Update the form values by directly passing field name and value
    console.log('name', name);
    console.log('value', value);
    onChange(name, value);
    
    // Validate the field after a short delay to allow for typing
    setTimeout(() => {
      validateSingleField(name, value);
    }, 300);
  };

  // Clear field errors when fields change significantly
  useEffect(() => {
    if (!fields) return;
    setFieldErrors({});
  }, [fields]);

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
        
        // Get any error for this field from combined errors
        const fieldError = combinedErrors ? combinedErrors[fieldName] : undefined;
        
        // Handle blur event for validation
        const handleBlur = () => {
          if (validationSchema) {
            validateSingleField(fieldName, field.value);
          }
        };
        
        // Render the appropriate component based on field type
        switch (field.type) {
          case 'group':
            return (
              <FormGroup
                key={fieldName}
                field={field}
                onChange={handleFieldChange}
                errors={combinedErrors}
              />
            );
          case 'array':
            return (
              <ArrayField
                key={fieldName}
                field={field}
                onChange={handleFieldChange}
                errors={combinedErrors}
              />
            );
          default:
            return (
              <FormField
                key={fieldName}
                field={field}
                value={field.value}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={fieldError}
                loading={field.loading}
              />
            );
        }
      })}
    </FormContainer>
  );
};

export default DynamicForm;
