import { flattenErrors, prepareInitialValues } from './formUtils';

describe('formUtils', () => {
  describe('flattenErrors', () => {
    test('returns empty object when errors is null or undefined', () => {
      expect(flattenErrors(null)).toEqual({});
      expect(flattenErrors(undefined)).toEqual({});
    });
    
    test('flattens simple error object', () => {
      const errors = {
        name: 'Name is required',
        email: 'Email is invalid'
      };
      
      expect(flattenErrors(errors)).toEqual({
        name: 'Name is required',
        email: 'Email is invalid'
      });
    });
    
    test('flattens nested error object', () => {
      const errors = {
        name: 'Name is required',
        contactInfo: {
          phone: 'Phone is invalid',
          address: 'Address is required'
        }
      };
      
      expect(flattenErrors(errors)).toEqual({
        name: 'Name is required',
        'contactInfo.phone': 'Phone is invalid',
        'contactInfo.address': 'Address is required'
      });
    });
    
    test('flattens array error object', () => {
      const errors = {
        name: 'Name is required',
        addresses: [
          {
            street: 'Street is required',
            city: 'City is required'
          },
          {
            zipCode: 'ZIP code is invalid'
          }
        ]
      };
      
      expect(flattenErrors(errors)).toEqual({
        name: 'Name is required',
        'addresses[0].street': 'Street is required',
        'addresses[0].city': 'City is required',
        'addresses[1].zipCode': 'ZIP code is invalid'
      });
    });
    
    test('handles deeply nested objects and arrays', () => {
      const errors = {
        user: {
          profile: {
            addresses: [
              {
                details: {
                  street: 'Street is required'
                }
              }
            ]
          }
        }
      };
      
      expect(flattenErrors(errors)).toEqual({
        'user.profile.addresses[0].details.street': 'Street is required'
      });
    });
  });
  
  describe('prepareInitialValues', () => {
    test('returns empty object when fields is null or undefined', () => {
      expect(prepareInitialValues(null)).toEqual({});
      expect(prepareInitialValues(undefined)).toEqual({});
    });
    
    test('prepares initial values for simple fields', () => {
      const fields = {
        name: { type: 'text' },
        email: { type: 'email' },
        age: { type: 'number' }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        name: '',
        email: '',
        age: ''
      });
    });
    
    test('prepares initial values for checkbox fields', () => {
      const fields = {
        subscribe: { type: 'checkbox' },
        terms: { type: 'checkbox' }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        subscribe: false,
        terms: false
      });
    });
    
    test('prepares initial values for checkboxes fields', () => {
      const fields = {
        interests: { type: 'checkboxes' },
        categories: { type: 'checkboxes' }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        interests: [],
        categories: []
      });
    });
    
    test('prepares initial values for group fields', () => {
      const fields = {
        contactInfo: {
          type: 'group',
          fields: {
            phone: { type: 'text' },
            address: { type: 'text' }
          }
        }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        contactInfo: {
          phone: '',
          address: ''
        }
      });
    });
    
    test('prepares initial values for array fields', () => {
      const fields = {
        addresses: {
          type: 'array',
          fields: {
            street: { type: 'text' },
            city: { type: 'text' }
          }
        }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        addresses: []
      });
    });
    
    test('prepares initial values for complex nested fields', () => {
      const fields = {
        name: { type: 'text' },
        subscribe: { type: 'checkbox' },
        contactInfo: {
          type: 'group',
          fields: {
            phone: { type: 'text' },
            address: { type: 'text' }
          }
        },
        addresses: {
          type: 'array',
          fields: {
            street: { type: 'text' },
            city: { type: 'text' }
          }
        }
      };
      
      expect(prepareInitialValues(fields)).toEqual({
        name: '',
        subscribe: false,
        contactInfo: {
          phone: '',
          address: ''
        },
        addresses: []
      });
    });
  });
  
});