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
import { get } from 'lodash';

/**
 * ArrayField component for handling arrays of form fields.
 * Allows adding, removing, and editing items in the array.
 */
const ArrayField = ({ field, value = [], onChange, errors, loadingFields }) => {
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
    const newItems = [...value, createEmptyItem()];
    onChange(field.name, newItems);
  };

  // Remove an item from the array
  const handleRemoveItem = (index) => {
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(field.name, newItems);
  };

  // Update a field within an item
  const handleItemFieldChange = (index, fieldName, fieldValue) => {
    const newItems = [...value];
    newItems[index] = {
      ...newItems[index],
      [fieldName]: fieldValue
    };
    onChange(field.name, newItems);
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
              name: fieldName
            };
            
            // Get the current value for this field from the item
            const fieldValue = item[fieldName];
            
            // Get any error for this specific field in this specific item
            const fieldError = errors ? errors[`${field.name}[${index}].${fieldName}`] : undefined;
            
            return (
              <FormField
                key={fieldName}
                field={formField}
                value={fieldValue}
                onChange={(name, value) => handleItemFieldChange(index, name, value)}
                error={fieldError}
                loading={loadingFields && get(loadingFields, fieldName)}
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
