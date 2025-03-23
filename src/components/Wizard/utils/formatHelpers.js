/**
 * Format a value for display based on its field type and content
 * @param {any} value - The value to format
 * @param {object} field - The field definition containing type and options
 * @returns {string} - The formatted value as a string
 */
export const formatValue = (value, field) => {
  if (value === undefined || value === null || value === '') {
    return 'Not specified';
  }
  
  if (Array.isArray(value)) {
    if (field.type === 'multiselect' || field.type === 'checkboxes') {
      // For multiselect/checkboxes, map values to labels
      return value.map(v => {
        const option = field.options?.find(opt => opt.value === v);
        return option ? option.label : v;
      }).join(', ');
    } else if (field.type === 'array') {
      // For array fields, show count
      return `${value.length} items`;
    }
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return 'Complex value';
  }
  
  if (field.type === 'select') {
    // For select fields, show the label instead of the value
    const option = field.options?.find(opt => opt.value === value);
    return option ? option.label : value;
  }
  
  if (field.type === 'date') {
    return new Date(value).toLocaleDateString();
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
    // Make sure value is an object before trying to access its properties
    const groupValue = value && typeof value === 'object' ? value : {};
    
    return {
      type: 'group',
      key: currentPath,
      label: field.label,
      children: Object.keys(field.fields).map(childName => {
        // Use field.fields[childName] for the child field definition
        // and groupValue[childName] for the child field value
        return prepareFieldValue(
          childName, 
          groupValue[childName], 
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
