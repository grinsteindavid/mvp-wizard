/**
 * Utility functions for handling form field operations
 */
import { set } from 'lodash';
import { validateAndUpdateErrors } from '../../utils/validationUtils';
import { transformFieldsForValidation } from '../../components/Wizard/utils/formatHelpers';


/**
 * Normalize field paths between different array notations
 * Converts between: 
 * - Dot notation: 'items.0.name'
 * - Bracket notation: 'items[0].name'
 * @param {string} fieldPath - Field path to normalize
 * @returns {string} - Normalized field path
 */
export const normalizeArrayFieldPath = (fieldPath) => {
  if (!fieldPath) return '';
  
  // Convert dot notation to bracket notation
  // Example: converts 'items.0.name' to 'items[0].name'
  let normalized = fieldPath.replace(/\.(\d+)(?=\.|$)/g, '[$1]');
  
  return normalized;
};

/**
 * Builds a path to a nested field's property
 * @param {string[]} parts - Array of field path parts (e.g. ['targeting', 'countries'])
 * @param {string} property - The property to target (e.g. 'value', 'loading', 'options')
 * @returns {string} - The constructed path to the field property
 */
export const buildNestedFieldPath = (parts, property) => {
  if (!parts || parts.length === 0) return '';
  
  // Special case for single-element array (top-level field)
  if (parts.length === 1) {
    return `fields.${parts[0]}.${property}`;
  }
  
  return parts.reduce((path, part, index) => {
    if (index === 0) {
      // First part is the top-level field name
      return `fields.${part}`;
    } else if (index < parts.length - 1) {
      // Middle parts need to include 'fields.' prefix
      return `${path}.fields.${part}`;
    } else {
      // Last part is the actual field name
      return `${path}.fields.${part}.${property}`;
    }
  }, '');
};

/**
 * Updates a field value in the form state
 * @param {Object} draft - Immer draft state
 * @param {string} field - Field path in dot notation
 * @param {any} value - New value for the field
 */
export const updateFieldValue = (draft, field, value) => {
  const parts = field.split('.');
  
  if (parts.length > 1) {
    // For nested fields, construct the path
    const nestedPath = buildNestedFieldPath(parts, 'value');
    set(draft, nestedPath, value);
  } else {
    // For top-level fields, use the simple path
    set(draft, `fields.${field}.value`, value);
  }
};

/**
 * Applies validation to the form and updates errors
 * @param {Object} draft - Immer draft state
 * @param {string} field - Field being updated
 * @param {any} value - New value for the field
 * @param {Object|Function} validationSchema - Joi schema or function that returns a schema
 * @param {Object} touchedFields - Object tracking which fields have been touched
 * @param {boolean} validateAll - Whether to validate all fields or just touched ones
 */
export const applyFieldValidation = (draft, field, value, validationSchema, touchedFields = {}, validateAll = false) => {
  // Use transformFieldsForValidation to build the complete form data object
  const formData = transformFieldsForValidation(draft.fields);
  if (validationSchema) {
    // Call the utility function to get validation results
    const validationResult = validateAndUpdateErrors(
      formData,
      field,
      value,
      validationSchema
    );
    
    // We'll keep a full record of all validation errors internally
    const allErrors = validationResult.errors;
    
    // But we'll only display errors for touched fields or if validateAll is true
    const displayErrors = {};
    
    // Process each error field and check if it's been touched
    Object.entries(allErrors).forEach(([errorField, errorMessage]) => {
      // Include error if the field has been touched by the user already
      // validateAll case is handled separately below
      
      // Handle array field format differences between Joi and our code
      // Joi returns: categoryGroups.0.name
      // Our field path: categoryGroups[0].name
      const normalizedErrorField = normalizeArrayFieldPath(errorField);
      
      // Only add the error if this specific field has been touched
      // We're not adding errors for the current field being validated unless it's specifically marked as touched
      if (touchedFields[normalizedErrorField]) {
        displayErrors[errorField] = errorMessage;
      }
    });

    
    // Update displayed errors (what the user sees)
    draft.errors = validateAll ? allErrors : displayErrors;
    
    // The form is valid only if there are no errors in the complete validation
    draft.isValid = Object.keys(allErrors).length === 0;
    
    // Store full validation state for internal use (like submit validation)
    draft._fullValidationErrors = allErrors;
  } else {
    // If no schema provided, just clear the error for this field
    if (draft.errors && draft.errors[field]) {
      delete draft.errors[field];
      
      // Also remove from full validation errors if they exist
      if (draft._fullValidationErrors && draft._fullValidationErrors[field]) {
        delete draft._fullValidationErrors[field];
      }
    }
  }
};
