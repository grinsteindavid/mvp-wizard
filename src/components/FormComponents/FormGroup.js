import React from 'react';
import FormField from './FormField';
import { GroupContainer, GroupTitle } from './styled/FormElements';


/**
 * FormGroup component for rendering a group of related form fields.
 * Groups fields together visually and handles nested field values.
 * Updated to work with field values and loading states stored within field definitions.
 */
const FormGroup = ({ field, onChange, errors }) => {
  const handleFieldChange = (fieldName, fieldValue) => {
    // Pass the fully qualified field name to the parent
    onChange(`${field.name}.${fieldName}`, fieldValue);
  };

  return (
    <GroupContainer>
      <GroupTitle>{field.label}</GroupTitle>
      {Object.entries(field.fields).map(([fieldName, fieldConfig]) => {
        // Create a field object that FormField can use
        const formField = {
          ...fieldConfig,
          name: fieldName
        };
        
        // Get any error for this field
        const fieldError = errors ? errors[`${field.name}.${fieldName}`] : undefined;
        
        return (
          <FormField
            key={fieldName}
            field={formField}
            value={fieldConfig.value}
            onChange={handleFieldChange}
            error={fieldError}
            loading={fieldConfig.loading}
            useDebouncing={false}
          />
        );
      })}
    </GroupContainer>
  );
};

export default FormGroup;
