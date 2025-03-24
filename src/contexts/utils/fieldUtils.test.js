import { buildNestedFieldPath, updateFieldValue, applyFieldValidation } from './fieldUtils';
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
      transformFieldsForValidation.mockReturnValue({ name: 'Test' });
    });

    it('should apply validation when schema is provided', () => {
      const draft = {
        fields: { name: { value: 'Test' } },
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
        { name: 'Test' },
        'name',
        'Test',
        schema
      );
      expect(draft.errors).toEqual({});
      expect(draft.isValid).toBe(true);
    });

    it('should just clear field error when no schema is provided', () => {
      const draft = {
        fields: { name: { value: 'Test' } },
        errors: { name: 'Required field', email: 'Invalid email' }
      };

      applyFieldValidation(draft, 'name', 'Test', null);

      expect(validationUtils.validateAndUpdateErrors).not.toHaveBeenCalled();
      expect(draft.errors).toEqual({ email: 'Invalid email' });
    });
  });
});
