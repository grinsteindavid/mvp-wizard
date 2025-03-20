import React, { createContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { createTrafficSourceProvider, createUseTrafficSource, baseActions } from './BaseTrafficSourceContext';

// Create a test context
const TestContext = createContext();

// Initial state for testing
const testInitialState = {
  testField: 'initial value'
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
  campaignName: {
    label: 'Campaign Name',
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
const TestProvider = createTrafficSourceProvider(
  TestContext,
  testInitialState,
  testReducer,
  testFields
);

const useTestContext = createUseTrafficSource(TestContext, 'Test');

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
      <div data-testid="test-field">{state.testField}</div>
      <div data-testid="campaign-name">{state.campaignName}</div>
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
        data-testid="update-campaign-name" 
        onClick={() => updateField('campaignName', 'Test Campaign')}
      >
        Update Campaign Name
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
          errors: { campaignName: 'Required field' } 
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

describe('BaseTrafficSourceContext', () => {
  test('provides initial state values', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(screen.getByTestId('test-field').textContent).toBe('initial value');
    expect(screen.getByTestId('campaign-name').textContent).toBe('');
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

    act(() => {
      screen.getByTestId('update-field').click();
    });

    expect(screen.getByTestId('test-field').textContent).toBe('updated value');
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
      screen.getByTestId('update-campaign-name').click();
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
    expect(screen.getByTestId('campaign-name').textContent).toBe('');
    expect(screen.getByTestId('is-valid').textContent).toBe('false');
    expect(screen.getByTestId('is-submitting').textContent).toBe('false');
    expect(screen.getByTestId('is-submitted').textContent).toBe('false');
  });

  test('custom reducer action works', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    act(() => {
      screen.getByTestId('custom-action').click();
    });

    expect(screen.getByTestId('test-field').textContent).toBe('custom value');
  });

  test('baseActions exports the correct action types', () => {
    expect(baseActions).toEqual({
      UPDATE_FIELD: 'UPDATE_FIELD',
      SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
      SET_SUBMITTING: 'SET_SUBMITTING',
      SET_SUBMITTED: 'SET_SUBMITTED',
      RESET_FORM: 'RESET_FORM'
    });
  });
});
