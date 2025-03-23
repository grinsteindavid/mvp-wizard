import React from 'react';
import FormField from './FormField';
import { 
  ArrayContainer, 
  GroupTitle as ArrayTitle, 
  ArrayItemContainer, 
  ArrayItemActions, 
  ActionButton, 
  Button, 
  ErrorMessage 
} from './styled/FormElements';


/**
 * ArrayField component for handling arrays of form fields.
 * Allows adding, removing, and editing items in the array.
 * Updated to work with field values and loading states stored within field definitions.
 */
const ArrayField = ({ field, onChange, errors }) => {
  // Get the array value from the field definition
  const value = field.value || [];
  
  // Create a new empty item based on the field configuration
  const createEmptyItem = () => {
    const item = {};
    Object.keys(field.fields).forEach(fieldName => {
      item[fieldName] = '';
    });
    return item;
  };

  // Add a new item to the array
  const handleAddItem = () => {
    // For array operations, we still need to pass the entire array
    // We'll handle this special case in the parent component
    const newItems = [...value, createEmptyItem()];
    onChange(field.name, newItems);
  };

  // Remove an item from the array
  const handleRemoveItem = (index) => {
    // For array operations, we still need to pass the entire array
    // We'll handle this special case in the parent component
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(field.name, newItems);
  };

  // Update a field within an item
  const handleItemFieldChange = (index, fieldName, fieldValue) => {
    // Pass the fully qualified field path to the parent
    onChange(`${field.name}[${index}].${fieldName}`, fieldValue);
  };

  // Get array-level error if any
  const arrayError = errors ? errors[field.name] : undefined;

  return (
    <ArrayContainer>
      <ArrayTitle>{field.label}</ArrayTitle>
      
      {value.map((item, index) => (
        <ArrayItemContainer key={index}>
          <ArrayItemActions>
            <ActionButton danger onClick={() => handleRemoveItem(index)}>×</ActionButton>
          </ArrayItemActions>
          
          {Object.entries(field.fields).map(([fieldName, fieldConfig]) => {
            // Create a field object that FormField can use
            const formField = {
              ...fieldConfig,
              name: fieldName,
              value: item[fieldName] // Set the value from the array item
            };
            
            // Get any error for this specific field in this specific item
            const fieldError = errors ? errors[`${field.name}[${index}].${fieldName}`] : undefined;
            
            return (
              <FormField
                key={fieldName}
                field={formField}
                value={item[fieldName]}
                onChange={(name, value) => handleItemFieldChange(index, name, value)}
                error={fieldError}
                loading={fieldConfig.loading}
              />
            );
          })}
        </ArrayItemContainer>
      ))}
      
      <Button onClick={handleAddItem}>
        Add {field.label.replace(/s$/, '')}
      </Button>
      
      {arrayError && <ErrorMessage>{arrayError}</ErrorMessage>}
    </ArrayContainer>
  );
};

export default ArrayField;
