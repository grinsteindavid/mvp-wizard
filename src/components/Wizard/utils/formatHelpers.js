/**
 * Transform field data structure for validation
 * @param {object} fields - The fields object from state.fields
 * @returns {object} - Transformed data in the format expected by validation schemas
 */
export const transformFieldsForValidation = (fields) => {
  if (!fields || typeof fields !== 'object') {
    return {};
  }

  const transformedData = {};

  Object.keys(fields).forEach(fieldName => {
    // Make sure the field and its value exist
    const field = fields[fieldName];
    if (field && field.hasOwnProperty('value')) {
      const { value, type } = field;

      // Transform based on field type, not field name
      if (type === 'array' && Array.isArray(value)) {
        // Array fields - keep the array structure
        transformedData[fieldName] = value;
      } else if (type === 'number' && value !== undefined) {
        // Number fields - ensure they're converted to numbers
        transformedData[fieldName] = Number(value);
      } else if (type === 'multiselect' && Array.isArray(value)) {
        // Multiselect fields - keep the array of selections
        transformedData[fieldName] = value;
      } else if (type === 'boolean' && value !== undefined) {
        // Boolean fields - ensure they're boolean type
        transformedData[fieldName] = Boolean(value);
      } else {
        // Standard case for other fields (string, select, etc.)
        transformedData[fieldName] = value;
      }
    }
  });

  return transformedData;
};

/**
 * Format a value for display based on its field type and content
 * @param {any} value - The value to format
 * @param {object} field - The field definition containing type and options
 * @returns {string} - The formatted value as a string
 */
/**
 * Format a value for display based on its field type and content
 * @param {any} value - The value to format
 * @param {object} field - The field definition containing type and options
 * @param {object} options - Additional formatting options
 * @param {boolean} options.shortened - Whether to shorten long values
 * @returns {string} - The formatted value as a string
 */
export const formatValue = (value, field, options = {}) => {
  // Handle empty values consistently
  if (value === undefined || value === null || value === '') {
    return '—'; // Using em dash for better visual indication of empty value
  }
  
  if (Array.isArray(value)) {
    if (field.type === 'multiselect' || field.type === 'checkboxes') {
      // For multiselect/checkboxes, map values to labels with better formatting
      const formattedValues = value.map(v => {
        const option = field.options?.find(opt => opt.value === v);
        return option ? option.label : String(v);
      });
      
      // Handle empty array
      if (formattedValues.length === 0) {
        return 'None selected';
      }
      
      // For large selections, show a summary if shortened option is enabled
      if (options.shortened && formattedValues.length > 3) {
        return `${formattedValues.slice(0, 3).join(', ')} and ${formattedValues.length - 3} more`;
      }
      
      return formattedValues.join(', ');
    } else if (field.type === 'array') {
      // For array fields, show count with proper pluralization
      const count = value.length;
      return count === 0 ? 'No items' : `${count} ${count === 1 ? 'item' : 'items'}`;
    }
    
    // For regular arrays, join with commas but limit length if shortened
    if (options.shortened && value.length > 5) {
      return `${value.slice(0, 5).join(', ')} and ${value.length - 5} more`;
    }
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    // Provide more informative descriptions for complex objects
    if (value === null) {
      return 'Not specified';
    }
    
    try {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return 'Empty object';
      } else if (keys.length <= 3) {
        // For simple objects with few properties, show a summary
        return keys.map(key => `${key}: ${typeof value[key] === 'object' ? '...' : value[key]}`).join(', ');
      }
      return `Object with ${keys.length} properties`;
    } catch (error) {
      return 'Complex value';
    }
  }
  
  if (field.type === 'select') {
    // For select fields, show the label instead of the value
    const option = field.options?.find(opt => opt.value === value);
    return option ? option.label : value;
  }
  
  if (field.type === 'date') {
    try {
      // Format date with more user-friendly display
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Use more readable date format with month name
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }
  
  return value.toString();
};

/**
 * Recursive function to render field values in the review step
 * @param {string} name - Field name
 * @param {any} value - Field value
 * @param {object} fields - Object containing field definitions
 * @param {string} parentPath - Path to the parent field
 * @returns {object} - Object with renderable information
 */
export const prepareFieldValue = (name, value, fields, parentPath = '') => {
  const field = fields[name];
  
  if (!field) return null;
  
  const currentPath = parentPath ? `${parentPath}.${name}` : name;
  
  if (field.type === 'group') {
    // For group fields, we need to process each child field
    return {
      type: 'group',
      key: currentPath,
      label: field.label,
      children: Object.keys(field.fields).map(childName => {
        // Get the child field's value directly from its definition
        // This ensures we get the correct value for form group child fields
        const childField = field.fields[childName];
        const childValue = childField.value;
        
        return prepareFieldValue(
          childName, 
          childValue, 
          field.fields, 
          currentPath
        );
      }).filter(Boolean) // Filter out null values
    };
  }
  
  if (field.type === 'array') {
    // For array fields, make sure value is an array before processing
    const arrayValue = Array.isArray(value) ? value : [];
    
    return {
      type: 'array',
      key: currentPath,
      label: field.label,
      count: arrayValue.length,
      items: arrayValue.map((item, index) => ({
        index,
        fields: Object.keys(field.fields).map(childName => {
          const childField = field.fields[childName];
          const childValue = item && typeof item === 'object' ? item[childName] : undefined;
          
          return {
            key: `${currentPath}-${index}-${childName}`,
            label: childField.label,
            value: formatValue(childValue, childField)
          };
        })
      }))
    };
  }
  
  // For simple fields, just return the formatted value
  return {
    type: 'simple',
    key: currentPath,
    label: field.label,
    value: formatValue(value, field)
  };
};
