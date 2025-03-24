/**
 * Utility functions for handling form field operations
 */
import { set } from 'lodash';
import { validateAndUpdateErrors } from '../../utils/validationUtils';
import { transformFieldsForValidation } from '../../components/Wizard/utils/formatHelpers';

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
 */
export const applyFieldValidation = (draft, field, value, validationSchema) => {
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
    
    // Update errors and validity state
    draft.errors = validationResult.errors;
    draft.isValid = validationResult.isValid;
  } else {
    // If no schema provided, just clear the error for this field
    if (draft.errors && draft.errors[field]) {
      delete draft.errors[field];
    }
  }
};
