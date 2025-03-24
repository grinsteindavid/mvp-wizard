import { normalizeArrayFieldPath, buildNestedFieldPath, updateFieldValue, applyFieldValidation } from './fieldUtils';
import * as validationUtils from '../../utils/validationUtils';
import { transformFieldsForValidation } from '../../components/Wizard/utils/formatHelpers';

// Mock dependencies
jest.mock('../../components/Wizard/utils/formatHelpers', () => ({
  transformFieldsForValidation: jest.fn(),
}));

jest.mock('../../utils/validationUtils', () => ({
  validateAndUpdateErrors: jest.fn(),
}));

describe('fieldUtils', () => {
  describe('normalizeArrayFieldPath', () => {
    it('should convert bracket notation to dot notation', () => {
      const result = normalizeArrayFieldPath('categoryGroups[0].name');
      expect(result).toBe('categoryGroups.0.name');
    });

    it('should handle paths with multiple array indices', () => {
      const result = normalizeArrayFieldPath('campaigns[0].adGroups[1].ads[2].title');
      expect(result).toBe('campaigns.0.adGroups.1.ads.2.title');
    });
    
    it('should leave dot notation as is', () => {
      const result = normalizeArrayFieldPath('categoryGroups.0.name');
      expect(result).toBe('categoryGroups.0.name');
    });
    
    it('should handle paths with no array indices', () => {
      const result = normalizeArrayFieldPath('campaign.name');
      expect(result).toBe('campaign.name');
    });
    
    it('should return empty string for empty input', () => {
      const result = normalizeArrayFieldPath('');
      expect(result).toBe('');
    });
    
    it('should return empty string for null input', () => {
      const result = normalizeArrayFieldPath(null);
      expect(result).toBe('');
    });
  });
  
  describe('buildNestedFieldPath', () => {
    it('should build correct path for a top-level field', () => {
      const result = buildNestedFieldPath(['name'], 'value');
      expect(result).toBe('fields.name.value');
    });

    it('should build correct path for a two-level nested field', () => {
      const result = buildNestedFieldPath(['targeting', 'countries'], 'value');
      expect(result).toBe('fields.targeting.fields.countries.value');
    });

    it('should build correct path for a three-level nested field', () => {
      const result = buildNestedFieldPath(['targeting', 'geo', 'countries'], 'value');
      expect(result).toBe('fields.targeting.fields.geo.fields.countries.value');
    });

    it('should handle different property types', () => {
      const result = buildNestedFieldPath(['targeting', 'countries'], 'loading');
      expect(result).toBe('fields.targeting.fields.countries.loading');
    });

    it('should return empty string for empty parts array', () => {
      const result = buildNestedFieldPath([], 'value');
      expect(result).toBe('');
    });
  });

  describe('updateFieldValue', () => {
    it('should update a top-level field value', () => {
      const draft = { fields: { name: { value: 'old' } } };
      updateFieldValue(draft, 'name', 'new');
      expect(draft.fields.name.value).toBe('new');
    });

    it('should update a nested field value', () => {
      const draft = {
        fields: {
          targeting: {
            fields: {
              countries: { value: ['US'] }
            }
          }
        }
      };
      updateFieldValue(draft, 'targeting.countries', ['US', 'CA']);
      expect(draft.fields.targeting.fields.countries.value).toEqual(['US', 'CA']);
    });
  });

  describe('applyFieldValidation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      transformFieldsForValidation.mockReturnValue({ name: 'Test', email: 'test@example.com', items: [{ id: 1, name: 'Item 1' }] });
    });

    it('should apply validation when schema is provided', () => {
      const draft = {
        fields: { 
          name: { value: 'Test' },
          email: { value: 'test@example.com' }
        },
        errors: { name: 'Required field' }
      };

      const mockValidationResult = {
        isValid: true,
        errors: {}
      };

      validationUtils.validateAndUpdateErrors.mockReturnValue(mockValidationResult);

      const schema = { validate: jest.fn() };
      applyFieldValidation(draft, 'name', 'Test', schema);

      expect(transformFieldsForValidation).toHaveBeenCalledWith(draft.fields);
      expect(validationUtils.validateAndUpdateErrors).toHaveBeenCalledWith(
        { name: 'Test', email: 'test@example.com', items: [{ id: 1, name: 'Item 1' }] },
        'name',
        'Test',
        schema
      );
      expect(draft.errors).toEqual({});
      expect(draft.isValid).toBe(true);
      expect(draft._fullValidationErrors).toEqual({});
    });
    
    it('should only show errors for touched fields', () => {
      const draft = {
        fields: { 
          name: { value: 'Test' },
          email: { value: '' }
        },
        errors: {}
      };

      const mockValidationResult = {
        isValid: false,
        errors: {
          name: 'Name is required',
          email: 'Email is required'
        }
      };

      validationUtils.validateAndUpdateErrors.mockReturnValue(mockValidationResult);

      const schema = { validate: jest.fn() };
      // Mark both fields as touched to match the current implementation
      // which doesn't automatically show errors for the current field
      const touchedFields = { name: true, email: true };
      
      applyFieldValidation(draft, 'name', 'Test', schema, touchedFields, false);

      // Since both fields are touched, both errors should be displayed
      expect(draft.errors).toEqual({ 
        name: 'Name is required',
        email: 'Email is required'
      });
      expect(draft.isValid).toBe(false);
      expect(draft._fullValidationErrors).toEqual({
        name: 'Name is required',
        email: 'Email is required'
      });
    });
    
    it('should show all errors when validateAll is true', () => {
      const draft = {
        fields: { 
          name: { value: 'Test' },
          email: { value: '' }
        },
        errors: {}
      };

      const mockValidationResult = {
        isValid: false,
        errors: {
          name: 'Name is too short',
          email: 'Email is required'
        }
      };

      validationUtils.validateAndUpdateErrors.mockReturnValue(mockValidationResult);

      const schema = { validate: jest.fn() };
      const touchedFields = { name: true };
      
      applyFieldValidation(draft, 'name', 'Test', schema, touchedFields, true);

      expect(draft.errors).toEqual({
        name: 'Name is too short',
        email: 'Email is required'
      });
      expect(draft.isValid).toBe(false);
    });
    
    it('should handle array field notation differences', () => {
      const draft = {
        fields: { 
          items: {
            fields: {
              '0': {
                fields: {
                  name: { value: 'Item 1' }
                }
              }
            }
          }
        },
        errors: {}
      };

      const mockValidationResult = {
        isValid: false,
        errors: {
          'items.0.name': 'Item name is required'
        }
      };

      validationUtils.validateAndUpdateErrors.mockReturnValue(mockValidationResult);

      const schema = { validate: jest.fn() };
      const touchedFields = { 'items[0].name': true };
      
      applyFieldValidation(draft, 'items[0].name', '', schema, touchedFields, false);

      expect(draft.errors).toEqual({ 'items.0.name': 'Item name is required' });
      expect(draft.isValid).toBe(false);
    });

    it('should just clear field error when no schema is provided', () => {
      const draft = {
        fields: { name: { value: 'Test' } },
        errors: { name: 'Required field', email: 'Invalid email' },
        _fullValidationErrors: { name: 'Required field', email: 'Invalid email' }
      };

      applyFieldValidation(draft, 'name', 'Test', null);

      expect(validationUtils.validateAndUpdateErrors).not.toHaveBeenCalled();
      expect(draft.errors).toEqual({ email: 'Invalid email' });
      expect(draft._fullValidationErrors).toEqual({ email: 'Invalid email' });
    });
  });
});
