import React from 'react';
import FormField from './FormField';
import { GroupContainer, GroupTitle } from './styled/FormElements';

/**
 * FormGroup component for rendering a group of related form fields.
 * Groups fields together visually and handles nested field values.
 */
const FormGroup = ({ field, values, onChange, errors }) => {
  const handleFieldChange = (fieldName, fieldValue) => {
    // Update the nested field within the group
    const updatedGroupValue = {
      ...values,
      [fieldName]: fieldValue
    };
    
    // Pass the entire updated group value to the parent
    onChange(field.name, updatedGroupValue);
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
        
        // Get the current value for this field from the group values
        const fieldValue = values ? values[fieldName] : undefined;
        
        // Get any error for this field
        const fieldError = errors ? errors[`${field.name}.${fieldName}`] : undefined;
        
        return (
          <FormField
            key={fieldName}
            field={formField}
            value={fieldValue}
            onChange={handleFieldChange}
            error={fieldError}
          />
        );
      })}
    </GroupContainer>
  );
};

export default FormGroup;
