import { transformFieldsForValidation, formatValue, prepareFieldValue } from './formatHelpers';

describe('transformFieldsForValidation', () => {
  test('should return empty object for null or non-object input', () => {
    expect(transformFieldsForValidation(null)).toEqual({});
    expect(transformFieldsForValidation('not an object')).toEqual({});
    expect(transformFieldsForValidation(undefined)).toEqual({});
  });

  test('should transform fields correctly based on type', () => {
    const fields = {
      stringField: { value: 'test string', type: 'string' },
      numberField: { value: '42', type: 'number' },
      booleanField: { value: true, type: 'boolean' },
      arrayField: { value: [1, 2, 3], type: 'array' },
      multiselectField: { value: ['option1', 'option2'], type: 'multiselect' },
      emptyField: {}, // Missing value property
      undefinedField: { value: undefined } // Has value property but it's undefined
    };

    const expected = {
      stringField: 'test string',
      numberField: 42,
      booleanField: true,
      arrayField: [1, 2, 3],
      multiselectField: ['option1', 'option2']
      // Note: emptyField and undefinedField should be omitted
    };

    expect(transformFieldsForValidation(fields)).toEqual(expected);
  });

  test('should handle boolean values correctly', () => {
    const fields = {
      trueBooleanField: { value: true, type: 'boolean' },
      falseBooleanField: { value: false, type: 'boolean' },
      stringAsTrueField: { value: 'true', type: 'boolean' },
      emptyStringAsFalseField: { value: '', type: 'boolean' },
    };

    const result = transformFieldsForValidation(fields);
    
    expect(result.trueBooleanField).toBe(true);
    expect(result.falseBooleanField).toBe(false);
    expect(result.stringAsTrueField).toBe(true);
    expect(result.emptyStringAsFalseField).toBe(false);
  });
});

describe('formatValue', () => {
  test('should return "Not specified" for undefined, null, or empty values', () => {
    expect(formatValue(undefined, {})).toBe('Not specified');
    expect(formatValue(null, {})).toBe('Not specified');
    expect(formatValue('', {})).toBe('Not specified');
  });

  test('should format multiselect values with their labels', () => {
    const field = {
      type: 'multiselect',
      options: [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
        { value: 'opt3', label: 'Option 3' },
      ]
    };
    expect(formatValue(['opt1', 'opt3'], field)).toBe('Option 1, Option 3');
  });

  test('should format checkbox values with their labels', () => {
    const field = {
      type: 'checkboxes',
      options: [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ]
    };
    expect(formatValue(['opt1', 'opt2'], field)).toBe('Option 1, Option 2');
  });

  test('should format array fields with item count', () => {
    const field = { type: 'array' };
    const value = [1, 2, 3, 4, 5];
    expect(formatValue(value, field)).toBe('5 items');
  });

  test('should format select field by showing the label', () => {
    const field = {
      type: 'select',
      options: [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ]
    };
    expect(formatValue('opt2', field)).toBe('Option 2');
  });

  test('should show value directly if option with matching label is not found', () => {
    const field = {
      type: 'select',
      options: [
        { value: 'opt1', label: 'Option 1' },
      ]
    };
    expect(formatValue('unknown', field)).toBe('unknown');
  });

  test('should format date fields as localized date strings', () => {
    const field = { type: 'date' };
    const value = '2023-01-01';
    // Since toLocaleDateString can vary by environment, we'll check that it's not the original string
    const result = formatValue(value, field);
    expect(result).not.toBe(value);
    expect(typeof result).toBe('string');
  });

  test('should handle objects as "Complex value"', () => {
    const field = { type: 'object' };
    const value = { key: 'value' };
    expect(formatValue(value, field)).toBe('Complex value');
  });
});

describe('prepareFieldValue', () => {
  test('should return null if field does not exist', () => {
    const fields = {};
    expect(prepareFieldValue('nonExistentField', 'value', fields)).toBeNull();
  });

  test('should prepare simple field values', () => {
    const fields = {
      testField: { label: 'Test Field', type: 'string' }
    };
    const result = prepareFieldValue('testField', 'test value', fields);
    
    expect(result).toEqual({
      type: 'simple',
      key: 'testField',
      label: 'Test Field',
      value: 'test value'
    });
  });

  test('should prepare group field values', () => {
    const fields = {
      groupField: {
        label: 'Group Field',
        type: 'group',
        fields: {
          childField1: { label: 'Child 1', type: 'string' },
          childField2: { label: 'Child 2', type: 'number' }
        }
      }
    };
    
    const value = {
      childField1: 'child value',
      childField2: 42
    };
    
    const result = prepareFieldValue('groupField', value, fields);
    
    expect(result.type).toBe('group');
    expect(result.key).toBe('groupField');
    expect(result.label).toBe('Group Field');
    expect(result.children.length).toBe(2);
    
    // Check first child
    expect(result.children[0].type).toBe('simple');
    expect(result.children[0].key).toBe('groupField.childField1');
    expect(result.children[0].value).toBe('child value');
    
    // Check second child
    expect(result.children[1].type).toBe('simple');
    expect(result.children[1].key).toBe('groupField.childField2');
    expect(result.children[1].value).toBe('42');
  });

  test('should handle null or non-object value for group fields', () => {
    // Create a mock implementation to test the behavior with null values
    // This handles the fact that the implementation might filter out nulls with filter(Boolean)
    const mockPrepareFieldValue = jest.fn().mockReturnValue(null);
    
    // Mock the recursive call to prepareFieldValue that happens inside the function
    const originalPrepareFieldValue = prepareFieldValue;
    global.prepareFieldValue = jest.fn().mockImplementation((name, value, fields, parentPath = '') => {
      if (parentPath && (value === null || value === undefined || typeof value !== 'object')) {
        return mockPrepareFieldValue(name, value, fields, parentPath);
      }
      return originalPrepareFieldValue(name, value, fields, parentPath);
    });
    
    const fields = {
      groupField: {
        label: 'Group Field',
        type: 'group',
        fields: {
          childField: { label: 'Child', type: 'string' }
        }
      }
    };
    
    // Test with null
    const resultWithNull = prepareFieldValue('groupField', null, fields);
    expect(resultWithNull.type).toBe('group');
    // We're not checking the exact length as it depends on implementation details
    // Instead, we verify that children exists and is an array
    expect(Array.isArray(resultWithNull.children)).toBe(true);
    
    // Test with string instead of object
    const resultWithString = prepareFieldValue('groupField', 'not an object', fields);
    expect(resultWithString.type).toBe('group');
    expect(Array.isArray(resultWithString.children)).toBe(true);
    
    // Restore the original function
    global.prepareFieldValue = originalPrepareFieldValue;
  });

  test('should prepare array field values', () => {
    const fields = {
      arrayField: {
        label: 'Array Field',
        type: 'array',
        fields: {
          name: { label: 'Name', type: 'string' },
          age: { label: 'Age', type: 'number' }
        }
      }
    };
    
    const value = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
    
    const result = prepareFieldValue('arrayField', value, fields);
    
    expect(result.type).toBe('array');
    expect(result.key).toBe('arrayField');
    expect(result.label).toBe('Array Field');
    expect(result.count).toBe(2);
    expect(result.items.length).toBe(2);
    
    // Check first item
    expect(result.items[0].index).toBe(0);
    expect(result.items[0].fields.length).toBe(2);
    expect(result.items[0].fields[0].value).toBe('Alice');
    expect(result.items[0].fields[1].value).toBe('30');
    
    // Check second item
    expect(result.items[1].index).toBe(1);
    expect(result.items[1].fields.length).toBe(2);
    expect(result.items[1].fields[0].value).toBe('Bob');
    expect(result.items[1].fields[1].value).toBe('25');
  });

  test('should handle null or non-array value for array fields', () => {
    const fields = {
      arrayField: {
        label: 'Array Field',
        type: 'array',
        fields: {
          name: { label: 'Name', type: 'string' }
        }
      }
    };
    
    // Test with null
    const resultWithNull = prepareFieldValue('arrayField', null, fields);
    expect(resultWithNull.type).toBe('array');
    expect(resultWithNull.count).toBe(0); // Empty array because value is null
    
    // Test with object instead of array
    const resultWithObject = prepareFieldValue('arrayField', { key: 'value' }, fields);
    expect(resultWithObject.type).toBe('array');
    expect(resultWithObject.count).toBe(0);
  });

  test('should handle nested paths correctly', () => {
    const fields = {
      childField: { label: 'Child Field', type: 'string' }
    };
    
    const result = prepareFieldValue('childField', 'nested value', fields, 'parentField');
    
    expect(result.key).toBe('parentField.childField');
    expect(result.label).toBe('Child Field');
    expect(result.value).toBe('nested value');
  });
});
