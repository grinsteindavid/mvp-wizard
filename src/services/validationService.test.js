/* eslint-disable import/first */
// Mock dependencies first - must be before imports
jest.mock('../utils/validationUtils');
jest.mock('../schemas');

// Import modules
import { validateProject } from './validationService';
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
});
