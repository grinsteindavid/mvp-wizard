/**
 * Formats validation errors from Joi into a more usable format
 * @param {Object} error - Joi validation error object
 * @returns {Object} - Formatted errors object
 */
export const formatValidationErrors = (error) => {
  if (!error) return {};
  
  const errors = {};
  
  error.details.forEach((detail) => {
    const path = detail.path.join('.');
    errors[path] = detail.message;
  });
  
  return errors;
};

/**
 * Extracts a schema for a nested field path
 * @param {Object} schema - Joi schema object
 * @param {string} fieldPath - Dot notation path to the field
 * @returns {Object|null} - Extracted schema or null if not found
 */
export const extractNestedSchema = (schema, fieldPath) => {
  if (!schema || !fieldPath) return null;
  
  const parts = fieldPath.split('.');
  
  // Handle top-level fields
  if (parts.length === 1) {
    return schema.extract(fieldPath);
  }
  
  // Handle nested fields
  let currentSchema = schema;
  for (const part of parts) {
    if (!currentSchema) return null;
    currentSchema = currentSchema.extract(part);
  }
  
  return currentSchema;
};

/**
 * Validates form data against a schema and returns validation results
 * @param {Object} formData - The form data to validate
 * @param {string} field - The field being updated
 * @param {any} value - The new value for the field
 * @param {Object|Function} validationSchema - Joi schema or a function that returns a schema to validate against
 * @returns {Object} - Object containing isValid flag and errors object
 */
export const validateAndUpdateErrors = (formData, field, value, validationSchema) => {
  const result = {
    isValid: true,
    errors: {}
  };
  
  if (!validationSchema) return result;
  
  // Make sure to include the field we're currently updating
  // in case it hasn't been set in the form state yet
  const updatedFormData = { ...formData };
  const parts = field.split('.');
  
  if (parts.length > 1) {
    // For nested fields like 'bidding.amount'
    const [parent, child] = [parts[0], parts[1]];
    if (!updatedFormData[parent]) updatedFormData[parent] = {};
    updatedFormData[parent][child] = value;
  } else {
    // For top-level fields
    updatedFormData[field] = value;
  }
  
  try {
    // Handle both schema objects and schema creator functions
    const schema = typeof validationSchema === 'function' ? validationSchema() : validationSchema;
    
    // Check if we have a valid schema with a validate method
    if (!schema || typeof schema.validate !== 'function') {
      console.warn('Invalid validation schema provided');
      return result;
    }
    
    const { error } = schema.validate(updatedFormData, { abortEarly: false });
    
    // If there are validation errors, format and set them
    if (error) {
      // Format each error into a field-specific message
      error.details.forEach(detail => {
        const path = detail.path.join('.');
        result.errors[path] = detail.message;
      });
      
      result.isValid = false;
    }
  } catch (err) {
    console.error('Validation error:', err);
    // If validation fails catastrophically, set a general error
    result.errors._general = 'Validation error occurred';
    result.isValid = false;
  }
  
  return result;
};
