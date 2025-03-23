/**
 * Validation Service
 * 
 * This service provides methods for validating project data and individual fields
 * based on the data source. It uses the schemas defined in the schemas directory.
 */

import { schemaCreators } from '../schemas';
import { formatValidationErrors, extractNestedSchema } from '../utils/validationUtils';

/**
 * Validate project data based on data source
 * @param {string} dataSource - The data source identifier (primary, secondary, tertiary)
 * @param {Object} projectData - The project data to validate
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateProject = (dataSource, projectData) => {
  const createSchema = schemaCreators[dataSource];
  
  if (!createSchema) {
    return {
      isValid: false,
      errors: { general: 'Invalid data source' }
    };
  }

  try {
    // Create a fresh schema each time to avoid any potential issues with schema reuse
    const schema = createSchema();
    const { error } = schema.validate(projectData, { abortEarly: false });
    
    if (error) {
      const errors = formatValidationErrors(error);
      
      return {
        isValid: false,
        errors
      };
    }
    
    return {
      isValid: true,
      errors: {}
    };
  } catch (err) {
    return {
      isValid: false,
      errors: { general: 'Validation error occurred' }
    };
  }
};

/**
 * Validate a specific field
 * @param {Object} schema - The validation schema object
 * @param {string} fieldName - The name of the field to validate (can be dot notation for nested fields)
 * @param {any} value - The value to validate
 * @returns {Object} - Validation result with isValid flag and error message
 */
export const validateField = (schema, fieldName, value) => {
  if (!schema || typeof schema !== 'object') {
    return {
      isValid: false,
      error: 'Invalid schema'
    };
  }
  
  const fullSchema = schema;

  try {
    // Try to extract the field schema (handles both top-level and nested fields)
    const fieldSchema = fullSchema.extract(fieldName) || extractNestedSchema(fullSchema, fieldName);
    
    if (!fieldSchema) {
      // If we can't find a schema for this field, assume it's valid
      return {
        isValid: true,
        error: null
      };
    }
    
    // Validate the field
    const { error } = fieldSchema.validate(value);
    
    return {
      isValid: !error,
      error: error ? error.message : null
    };
  } catch (err) {
    return {
      isValid: false,
      error: 'Validation error occurred'
    };
  }
};
