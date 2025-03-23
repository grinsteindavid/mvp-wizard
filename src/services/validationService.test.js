/* eslint-disable import/first */
// Mock dependencies first - must be before imports
jest.mock('../utils/validationUtils');
jest.mock('../schemas');

// Import modules
import { validateProject, validateField } from './validationService';
import { formatValidationErrors, extractNestedSchema } from '../utils/validationUtils';
import { schemaCreators } from '../schemas';

describe('validationService', () => {
  // Mock schema and its methods
  const mockSchema = {
    validate: jest.fn(),
    extract: jest.fn()
  };
  
  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup validation utils mocks
    formatValidationErrors.mockImplementation((error) => {
      if (!error) return {};
      return { projectName: 'Project name is required' };
    });
    
    extractNestedSchema.mockReturnValue(null);
    
    // Setup schema creators
    schemaCreators.google = jest.fn().mockReturnValue(mockSchema);
    schemaCreators.revcontent = jest.fn().mockReturnValue(mockSchema);
    schemaCreators.yahoo = jest.fn().mockReturnValue(mockSchema);
  });
  
  describe('validateProject', () => {
    test('should return isValid true when validation passes', () => {
      // Setup
      mockSchema.validate.mockReturnValue({ error: null });
      
      // Execute
      const result = validateProject('google', { projectName: 'Test Project' });
      
      // Verify
      expect(result).toEqual({
        isValid: true,
        errors: {}
      });
    });
    
    test('should return isValid false with errors when validation fails', () => {
      // Setup
      const mockError = { details: [{ path: ['projectName'], message: 'Project name is required' }] };
      mockSchema.validate.mockReturnValue({ error: mockError });
      
      // Execute
      const result = validateProject('google', {});
      
      // Verify
      expect(result).toEqual({
        isValid: false,
        errors: { projectName: 'Project name is required' }
      });
    });
    
    test('should return isValid false when data source is invalid', () => {
      // Execute
      const result = validateProject('invalid', {});
      
      // Verify
      expect(result).toEqual({
        isValid: false,
        errors: { general: 'Invalid data source' }
      });
    });
  });
  
  describe('validateField', () => {
    test('should return isValid true when field validation passes', () => {
      // Setup
      const mockFieldSchema = { validate: jest.fn().mockReturnValue({ error: null }) };
      mockSchema.extract.mockReturnValue(mockFieldSchema);
      
      // Execute
      const result = validateField(mockSchema, 'projectName', 'Test Project');
      
      // Verify
      expect(result).toEqual({
        isValid: true,
        error: null
      });
    });
    
    test('should return isValid false with error when field validation fails', () => {
      // Setup
      const mockFieldSchema = { 
        validate: jest.fn().mockReturnValue({ 
          error: { message: 'Project name is required' } 
        }) 
      };
      mockSchema.extract.mockReturnValue(mockFieldSchema);
      
      // Execute
      const result = validateField(mockSchema, 'projectName', '');
      
      // Verify
      expect(result).toEqual({
        isValid: false,
        error: 'Project name is required'
      });
    });
    
    test('should return isValid false when schema is invalid', () => {
      // Execute
      const result = validateField(null, 'projectName', 'Test Project');
      
      // Verify
      expect(result).toEqual({
        isValid: false,
        error: 'Invalid schema'
      });
    });
  });
});
