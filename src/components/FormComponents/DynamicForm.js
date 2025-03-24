import React, { useEffect, useCallback } from 'react';
import FormField from './FormField';
import FormGroup from './FormGroup';
import ArrayField from './ArrayField';
import { FormContainer } from './styled/FormElements';

/**
 * DynamicForm component that renders a form based on a configuration object.
 * Supports different field types including groups and arrays.
 * Supports loading state from field definitions.
 * Updated to work with field values and loading states stored within field definitions.
 * Validation is now handled by the BaseDataSourceContext.
 */
const DynamicForm = ({ fields, onChange, errors, validateFieldOnBlur }) => {
  const handleFieldChange = useCallback((name, value) => {
    // Update the form values by directly passing field name and value
    onChange(name, value);
  }, [onChange]);

  const handleBlur = (name) => {
    // Trigger validation for this field on blur if the validation function is provided
    if (validateFieldOnBlur) {
      validateFieldOnBlur(name);
    }
  };

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
        
        // Get any error for this field from errors passed by context
        const fieldError = errors ? errors[fieldName] : undefined;
        
        // Render the appropriate component based on field type
        switch (field.type) {
          case 'group':
            return (
              <FormGroup
                key={fieldName}
                field={field}
                onChange={handleFieldChange}
                errors={errors}
              />
            );
          case 'array':
            return (
              <ArrayField
                key={fieldName}
                field={field}
                onChange={handleFieldChange}
                errors={errors}
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
                useDebouncing={true}
              />
            );
        }
      })}
    </FormContainer>
  );
};

export default DynamicForm;
