import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from './FormField';

// Mock the actual field type map to isolate FormField component
jest.mock('./fields', () => {
  // Create a real-like mock implementation for text fields
  const TextField = jest.fn(({ field }) => (
    <div data-testid="text-field">
      <label htmlFor={field.name}>{field.label}</label>
      <input id={field.name} />
    </div>
  ));
  
  return {
    fieldTypeMap: {
      text: TextField
    }
  };
});

// We need to import fieldTypeMap after the mock is set up
const { fieldTypeMap } = require('./fields');

describe('FormField', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    fieldTypeMap.text.mockClear();
  });
  
  test('renders the appropriate field component based on field type', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    render(
      <FormField 
        field={textField} 
        value="" 
        onChange={() => {}} 
        error={null} 
      />
    );
    
    // Check that the mocked component was called
    expect(fieldTypeMap.text).toHaveBeenCalled();
    
    // Verify the props passed to the mocked component
    const mockCall = fieldTypeMap.text.mock.calls[0][0];
    expect(mockCall.field).toEqual(textField);
    expect(mockCall.value).toBe("");
    expect(mockCall.error).toBeNull();
    expect(mockCall.disabled).toBe(false);
  });
  
  test('displays error message for unsupported field type', () => {
    const unsupportedField = {
      type: 'unsupported',
      name: 'testField',
      label: 'Test Field'
    };
    
    render(
      <FormField 
        field={unsupportedField} 
        value="" 
        onChange={() => {}} 
        error={null} 
      />
    );
    
    // Add a more specific selector with a test ID
    const errorContainer = screen.getByTestId('unsupported-field-error');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer.textContent).toContain('Unsupported field type:');
    expect(errorContainer.textContent).toContain('unsupported');
  });
  
  test('does not re-render when props have not changed', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Rerender with the same props
    rerender(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Component should still have been called only once (no re-render)
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
  });
  
  test('re-renders when value changes', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Rerender with a different value
    rerender(
      <FormField 
        field={textField} 
        value="changed" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Component should be called again (should re-render)
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(2);
  });
  
  test('re-renders when error changes', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Rerender with an error
    rerender(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error="This field is required" 
        disabled={false}
      />
    );
    
    // Component should be called again (should re-render)
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(2);
  });
  
  test('re-renders when disabled status changes', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Rerender with disabled=true
    rerender(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={true}
      />
    );
    
    // Component should be called again (should re-render)
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(2);
  });
  
  test('re-renders when field type changes', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Create a new field object with a different type
    const emailField = {
      ...textField,
      type: 'unsupported' // Using unsupported to avoid mock complexity
    };
    
    // Rerender with the new field type
    rerender(
      <FormField 
        field={emailField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Since we changed to an unsupported type, the original component shouldn't be called again
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    // Instead, we should see the error message for unsupported type
    // Add a more specific selector with a test ID
    const errorContainer = screen.getByTestId('unsupported-field-error');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer.textContent).toContain('Unsupported field type:');
    expect(errorContainer.textContent).toContain('unsupported');
  });
  
  test('does not re-render when onChange function changes', () => {
    const textField = {
      type: 'text',
      name: 'testField',
      label: 'Test Field'
    };
    
    const { rerender } = render(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => {}} 
        error={null} 
        disabled={false}
      />
    );
    
    // Initial render should call the component once
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
    
    // Rerender with a different onChange function
    rerender(
      <FormField 
        field={textField} 
        value="test" 
        onChange={() => console.log('New function')} 
        error={null} 
        disabled={false}
      />
    );
    
    // Component should still have been called only once (no re-render)
    expect(fieldTypeMap.text).toHaveBeenCalledTimes(1);
  });
});
