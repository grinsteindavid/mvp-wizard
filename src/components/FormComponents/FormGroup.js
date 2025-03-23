import React from 'react';
import FormField from './FormField';
import { GroupContainer, GroupTitle } from './styled/FormElements';
import styled from 'styled-components';

// Add a styled container for form fields within a group
const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: ${props => props.columns > 1 ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr'};
    gap: 24px 20px;
  }
`;

const GroupDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 20px;
  line-height: 1.5;
`;

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

  // Calculate how many columns the grid should have based on field count
  const fieldCount = Object.keys(field.fields).length;
  const columnsCount = fieldCount > 1 && fieldCount <= 6 ? 2 : 1;
  
  // Group single-field rows together for better visual layout
  const shouldGroup = fieldCount > 3;

  return (
    <GroupContainer>
      <GroupTitle>{field.label}</GroupTitle>
      {field.description && <GroupDescription>{field.description}</GroupDescription>}
      
      <FieldsContainer columns={columnsCount}>
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
              useDebouncing={shouldGroup}
            />
          );
        })}
      </FieldsContainer>
    </GroupContainer>
  );
};

export default FormGroup;
