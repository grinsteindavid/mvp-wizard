import React, { createContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { createDataSourceProvider, createUseDataSource, baseActions } from './BaseDataSourceContext';

// Create a test context
const TestContext = createContext();

// Initial state for testing
const testInitialState = {
  testField: 'initial value',
  fields: {
    testField: {
      label: 'Test Field',
      type: 'text',
      required: false,
      value: 'initial value'
    }
  }
};

// Test-specific reducer
const testReducer = (state, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return {
        ...state,
        testField: action.payload
      };
    default:
      return state;
  }
};

// Test fields
const testFields = {
  projectName: {
    label: 'Project Name',
    type: 'text',
    required: true
  },
  testField: {
    label: 'Test Field',
    type: 'text',
    required: false
  }
};

// Create provider and hook for testing
const TestProvider = createDataSourceProvider(
  TestContext,
  testInitialState,
  testReducer,
  testFields
);

const useTestContext = createUseDataSource(TestContext, 'Test');

// Test component that uses the context
const TestComponent = () => {
  const { 
    state, 
    updateField, 
    setValidationResult, 
    setSubmitting,
    setSubmitted,
    resetForm,
    dispatch 
  } = useTestContext();

  return (
    <div>
      <div data-testid="test-field">{state.fields?.testField?.value || state.testField}</div>
      <div data-testid="project-name">{state.projectName}</div>
      <div data-testid="is-valid">{state.isValid.toString()}</div>
      <div data-testid="is-submitting">{state.isSubmitting.toString()}</div>
      <div data-testid="is-submitted">{state.isSubmitted.toString()}</div>
      <button 
        data-testid="update-field" 
        onClick={() => updateField('testField', 'updated value')}
      >
        Update Field
      </button>
      <button 
        data-testid="update-project-name" 
        onClick={() => updateField('projectName', 'Test Project')}
      >
        Update Project Name
      </button>
      <button 
        data-testid="set-validation" 
        onClick={() => setValidationResult({ isValid: true, errors: {} })}
      >
        Set Valid
      </button>
      <button 
        data-testid="set-validation-invalid" 
        onClick={() => setValidationResult({ 
          isValid: false, 
          errors: { projectName: 'Required field' } 
        })}
      >
        Set Invalid
      </button>
      <button 
        data-testid="set-submitting" 
        onClick={() => setSubmitting(true)}
      >
        Set Submitting
      </button>
      <button 
        data-testid="set-submitted" 
        onClick={() => setSubmitted(true)}
      >
        Set Submitted
      </button>
      <button 
        data-testid="reset-form" 
        onClick={resetForm}
      >
        Reset Form
      </button>
      <button 
        data-testid="custom-action" 
        onClick={() => dispatch({ type: 'TEST_ACTION', payload: 'custom value' })}
      >
        Custom Action
      </button>
    </div>
  );
};

describe('BaseDataSourceContext', () => {
  test('provides initial state values', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(screen.getByTestId('test-field').textContent).toBe('initial value');
    expect(screen.getByTestId('project-name').textContent).toBe('');
    expect(screen.getByTestId('is-valid').textContent).toBe('false');
    expect(screen.getByTestId('is-submitting').textContent).toBe('false');
    expect(screen.getByTestId('is-submitted').textContent).toBe('false');
  });

  test('updateField updates a field value', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    // Get the initial value
    expect(screen.getByTestId('test-field').textContent).toBe('initial value');
    
    // Click the button to update the field
    act(() => {
      screen.getByTestId('update-field').click();
    });

    // Verify the field value was updated
    expect(screen.getByTestId('test-field')).toHaveTextContent('updated value');
  });

  test('setValidationResult updates validation state', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    act(() => {
      screen.getByTestId('set-validation').click();
    });

    expect(screen.getByTestId('is-valid').textContent).toBe('true');
  });

  test('setValidationResult with errors updates validation state', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    act(() => {
      screen.getByTestId('set-validation-invalid').click();
    });

    expect(screen.getByTestId('is-valid').textContent).toBe('false');
  });

  test('setSubmitting updates submitting state', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    act(() => {
      screen.getByTestId('set-submitting').click();
    });

    expect(screen.getByTestId('is-submitting').textContent).toBe('true');
  });

  test('setSubmitted updates submitted state', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    act(() => {
      screen.getByTestId('set-submitted').click();
    });

    expect(screen.getByTestId('is-submitted').textContent).toBe('true');
  });

  test('resetForm resets state to initial values', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    // First make some changes
    act(() => {
      screen.getByTestId('update-project-name').click();
      screen.getByTestId('set-validation').click();
      screen.getByTestId('set-submitting').click();
      screen.getByTestId('set-submitted').click();
    });

    // Then reset
    act(() => {
      screen.getByTestId('reset-form').click();
    });

    // Check that values are reset
    // Note: The baseReducer's RESET_FORM action resets to baseInitialState, not the combined initial state
    // So testField will be empty, not 'initial value'
    expect(screen.getByTestId('test-field').textContent).toBe('');
    expect(screen.getByTestId('project-name').textContent).toBe('');
    expect(screen.getByTestId('is-valid').textContent).toBe('false');
    expect(screen.getByTestId('is-submitting').textContent).toBe('false');
    expect(screen.getByTestId('is-submitted').textContent).toBe('false');
  });

  test('custom reducer action works', () => {
    // Create a test component that displays the value directly
    const CustomTestComponent = () => {
      const { state, dispatch } = useTestContext();
      return (
        <div>
          <div data-testid="custom-field">{state.testField}</div>
          <button
            data-testid="custom-action"
            onClick={() => dispatch({ type: 'TEST_ACTION', payload: 'custom value' })}
          >
            Custom Action
          </button>
        </div>
      );
    };

    render(
      <TestProvider>
        <CustomTestComponent />
      </TestProvider>
    );

    // Simulate clicking the custom action button
    act(() => {
      screen.getByTestId('custom-action').click();
    });

    // Verify the custom action updated the state
    expect(screen.getByTestId('custom-field').textContent).toBe('custom value');
  });

  test('baseActions exports the correct action types', () => {
    expect(baseActions).toEqual({
      UPDATE_FIELD_VALUE: 'UPDATE_FIELD_VALUE',
      SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
      SET_SUBMITTING: 'SET_SUBMITTING',
      SET_SUBMITTED: 'SET_SUBMITTED',
      RESET_FORM: 'RESET_FORM',
      SET_FIELD_LOADING: 'SET_FIELD_LOADING',
      UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS'
    });
  });
});
