import { formatValidationErrors, extractNestedSchema, validateAndUpdateErrors } from './validationUtils';

describe('validationUtils', () => {
  describe('formatValidationErrors', () => {
    test('should return empty object when error is null', () => {
      expect(formatValidationErrors(null)).toEqual({});
    });
    
    test('should format Joi error details into object with paths as keys', () => {
      const mockError = {
        details: [
          { path: ['projectName'], message: 'Project name is required' },
          { path: ['dailyBudget'], message: 'Daily budget must be at least $5' },
          { path: ['categoryGroups', 0, 'name'], message: 'Category group name is required' }
        ]
      };
      
      const result = formatValidationErrors(mockError);
      
      expect(result).toEqual({
        'projectName': 'Project name is required',
        'dailyBudget': 'Daily budget must be at least $5',
        'categoryGroups.0.name': 'Category group name is required'
      });
    });
    
    test('should handle empty details array', () => {
      const mockError = { details: [] };
      expect(formatValidationErrors(mockError)).toEqual({});
    });
  });
  
  describe('extractNestedSchema', () => {
    test('should return null when schema or fieldPath is null', () => {
      expect(extractNestedSchema(null, 'field')).toBeNull();
      expect(extractNestedSchema({}, null)).toBeNull();
    });
    
    test('should extract top-level field schema', () => {
      const mockFieldSchema = { type: 'string' };
      const mockSchema = {
        extract: jest.fn().mockReturnValue(mockFieldSchema)
      };
      
      const result = extractNestedSchema(mockSchema, 'projectName');
      
      expect(result).toBe(mockFieldSchema);
      expect(mockSchema.extract).toHaveBeenCalledWith('projectName');
    });
    
    test('should extract nested field schema', () => {
      const mockNestedSchema = { type: 'string' };
      const mockAdGroupSchema = {
        extract: jest.fn().mockReturnValue(mockNestedSchema)
      };
      const mockAdGroupsSchema = {
        extract: jest.fn().mockReturnValue(mockAdGroupSchema)
      };
      const mockSchema = {
        extract: jest.fn().mockReturnValue(mockAdGroupsSchema)
      };
      
      const result = extractNestedSchema(mockSchema, 'categoryGroups.0.name');
      
      expect(result).toBe(mockNestedSchema);
      expect(mockSchema.extract).toHaveBeenCalledWith('categoryGroups');
      expect(mockAdGroupsSchema.extract).toHaveBeenCalledWith('0');
      expect(mockAdGroupSchema.extract).toHaveBeenCalledWith('name');
    });
    
    test('should return null when a part of the path cannot be extracted', () => {
      const mockSchema = {
        extract: jest.fn().mockReturnValue(null)
      };
      
      const result = extractNestedSchema(mockSchema, 'categoryGroups.0.name');
      
      expect(result).toBeNull();
    });
  });

  describe('validateAndUpdateErrors', () => {
    test('should return isValid true and empty errors when validation passes', () => {
      // Mock validation schema
      const mockValidationSchema = {
        validate: jest.fn().mockReturnValue({ error: null })
      };
      
      const formData = { name: 'Test Project' };
      const field = 'name';
      const value = 'Test Project';
      
      const result = validateAndUpdateErrors(formData, field, value, mockValidationSchema);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(mockValidationSchema.validate).toHaveBeenCalledWith(
        { name: 'Test Project' },
        { abortEarly: false }
      );
    });
    
    test('should handle schema creator functions', () => {
      // Mock validation schema
      const mockSchema = {
        validate: jest.fn().mockReturnValue({ error: null })
      };
      
      // Mock schema creator function
      const mockSchemaCreator = jest.fn().mockReturnValue(mockSchema);
      
      const formData = { name: 'Test Project' };
      const field = 'name';
      const value = 'Test Project';
      
      const result = validateAndUpdateErrors(formData, field, value, mockSchemaCreator);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(mockSchemaCreator).toHaveBeenCalled();
      expect(mockSchema.validate).toHaveBeenCalledWith(
        { name: 'Test Project' },
        { abortEarly: false }
      );
    });
    
    test('should return validation errors when validation fails', () => {
      // Mock validation error
      const mockError = {
        details: [
          { path: ['name'], message: 'Name is required' },
          { path: ['budget'], message: 'Budget must be at least $5' }
        ]
      };
      
      // Mock validation schema
      const mockValidationSchema = {
        validate: jest.fn().mockReturnValue({ error: mockError })
      };
      
      const formData = { name: '' };
      const field = 'name';
      const value = '';
      
      const result = validateAndUpdateErrors(formData, field, value, mockValidationSchema);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        'name': 'Name is required',
        'budget': 'Budget must be at least $5'
      });
    });
    
    test('should update nested fields correctly', () => {
      // Mock validation schema
      const mockValidationSchema = {
        validate: jest.fn().mockReturnValue({ error: null })
      };
      
      const formData = { bidding: {} };
      const field = 'bidding.amount';
      const value = 100;
      
      const result = validateAndUpdateErrors(formData, field, value, mockValidationSchema);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(mockValidationSchema.validate).toHaveBeenCalledWith(
        { bidding: { amount: 100 } },
        { abortEarly: false }
      );
    });
    
    test('should handle exceptions during validation', () => {
      // Mock validation schema that throws an error
      const mockValidationSchema = {
        validate: jest.fn().mockImplementation(() => {
          throw new Error('Validation error');
        })
      };
      
      // Save original console.error
      const originalConsoleError = console.error;
      // Mock console.error
      console.error = jest.fn();
      
      const formData = { name: 'Test' };
      const field = 'name';
      const value = 'Test';
      
      const result = validateAndUpdateErrors(formData, field, value, mockValidationSchema);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({ _general: 'Validation error occurred' });
      expect(console.error).toHaveBeenCalled();
      
      // Restore original console.error
      console.error = originalConsoleError;
    });
    
    test('should return isValid true and empty errors when no validation schema is provided', () => {
      const formData = { name: 'Test Project' };
      const field = 'name';
      const value = 'Test Project';
      
      const result = validateAndUpdateErrors(formData, field, value, null);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    test('should handle invalid schema objects gracefully', () => {
      // Save original console.warn
      const originalConsoleWarn = console.warn;
      // Mock console.warn
      console.warn = jest.fn();
      
      const formData = { name: 'Test Project' };
      const field = 'name';
      const value = 'Test Project';
      
      // Test with an object that doesn't have a validate method
      const invalidSchema = { isValid: true };
      const result = validateAndUpdateErrors(formData, field, value, invalidSchema);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(console.warn).toHaveBeenCalledWith('Invalid validation schema provided');
      
      // Restore original console.warn
      console.warn = originalConsoleWarn;
    });
  });
});
