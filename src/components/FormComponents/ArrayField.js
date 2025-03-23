import React, { useRef } from 'react';
import { produce } from 'immer';
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
 * Completely refactored to ensure proper state management for array operations.
 */
const ArrayField = ({ field, onChange, errors }) => {
  // Ensure we always have a valid array value
  const arrayValue = Array.isArray(field.value) ? field.value : [];
  
  // Use a ref to keep track of the most recent values
  // This ensures we don't lose changes when multiple fields are updated
  const latestValuesRef = useRef(arrayValue);
  latestValuesRef.current = arrayValue;
  
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
    // Use Immer to create an immutable update
    const newItems = produce(latestValuesRef.current, draft => {
      draft.push(createEmptyItem());
    });
    
    // Update the entire array at once
    onChange(field.name, newItems);
  };

  // Remove an item from the array
  const handleRemoveItem = (index) => {
    // Validate index is within bounds
    if (index < 0 || index >= latestValuesRef.current.length) return;
    
    // Use Immer to create an immutable update
    const newItems = produce(latestValuesRef.current, draft => {
      draft.splice(index, 1);
    });
    
    onChange(field.name, newItems);
  };

  // Update a field within an item
  const handleItemFieldChange = (index, fieldName, fieldValue) => {
    // Validate index is within bounds
    if (index < 0 || index >= latestValuesRef.current.length) return;
    
    // Use Immer to create an immutable update
    const newItems = produce(latestValuesRef.current, draft => {
      draft[index][fieldName] = fieldValue;
    });
    
    // Update the entire array at once
    onChange(field.name, newItems);
  };

  // Get array-level error if any
  const arrayError = errors ? errors[field.name] : undefined;

  return (
    <ArrayContainer>
      <ArrayTitle>{field.label}</ArrayTitle>
      
      {arrayValue.map((item, index) => (
        <ArrayItemContainer key={`${field.name}-item-${index}`}>
          <ArrayItemActions>
            <ActionButton onClick={() => handleRemoveItem(index)}>×</ActionButton>
          </ArrayItemActions>
          
          {Object.entries(field.fields).map(([fieldName, fieldConfig]) => {
            // Create a field object that FormField can use
            const formField = {
              ...fieldConfig,
              name: fieldName,
            };
            
            // Get any error for this specific field in this specific item
            const fieldError = errors ? errors[`${field.name}[${index}].${fieldName}`] : undefined;
            
            return (
              <FormField
                key={`${field.name}-${index}-${fieldName}`}
                field={formField}
                value={item[fieldName] !== undefined ? item[fieldName] : ''}
                onChange={(name, value) => handleItemFieldChange(index, name, value)}
                error={fieldError}
                loading={fieldConfig.loading}
                useDebouncing={false}
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
