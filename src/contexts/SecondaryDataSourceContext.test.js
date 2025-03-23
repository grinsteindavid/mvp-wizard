import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SecondaryDataSourceProvider, useSecondaryDataSource, secondaryDataSourceActions } from './SecondaryDataSourceContext';

// Test component that uses the Secondary data source context
const TestComponent = () => {
  const { 
    state, 
    updateField, 
    dispatch 
  } = useSecondaryDataSource();

  return (
    <div>
      <div data-testid="project-name">{state.projectName}</div>
      <div data-testid="target-url">{state.targetUrl}</div>
      <div data-testid="bid-amount">{state.bidAmount}</div>
      <div data-testid="daily-budget">{state.dailyBudget}</div>
      <div data-testid="targeting-countries">{state.targeting.countries.length}</div>
      <div data-testid="targeting-devices">{state.targeting.devices.length}</div>
      <button 
        data-testid="update-project-name" 
        onClick={() => updateField('projectName', 'RevContent Test Project')}
      >
        Update Project Name
      </button>
      <button 
        data-testid="update-target-url" 
        onClick={() => updateField('targetUrl', 'https://example.com')}
      >
        Update Target URL
      </button>
      <button 
        data-testid="add-country" 
        onClick={() => dispatch({ 
          type: secondaryDataSourceActions.UPDATE_TARGETING, 
          field: 'countries', 
          value: [...state.targeting.countries, 'US'] 
        })}
      >
        Add Country
      </button>
      <button 
        data-testid="add-device" 
        onClick={() => dispatch({ 
          type: secondaryDataSourceActions.UPDATE_TARGETING, 
          field: 'devices', 
          value: [...state.targeting.devices, 'mobile'] 
        })}
      >
        Add Device
      </button>
    </div>
  );
};

describe('SecondaryDataSourceContext', () => {
  test('provides initial state values', () => {
    render(
      <SecondaryDataSourceProvider>
        <TestComponent />
      </SecondaryDataSourceProvider>
    );

    expect(screen.getByTestId('project-name').textContent).toBe('');
    expect(screen.getByTestId('target-url').textContent).toBe('');
    expect(screen.getByTestId('bid-amount').textContent).toBe('');
    expect(screen.getByTestId('daily-budget').textContent).toBe('');
    expect(screen.getByTestId('targeting-countries').textContent).toBe('0');
    expect(screen.getByTestId('targeting-devices').textContent).toBe('0');
  });

  test('updateField updates a field value', () => {
    render(
      <SecondaryDataSourceProvider>
        <TestComponent />
      </SecondaryDataSourceProvider>
    );

    act(() => {
      screen.getByTestId('update-project-name').click();
    });

    expect(screen.getByTestId('project-name').textContent).toBe('RevContent Test Project');

    act(() => {
      screen.getByTestId('update-target-url').click();
    });

    expect(screen.getByTestId('target-url').textContent).toBe('https://example.com');
  });

  test('UPDATE_TARGETING action updates targeting fields', () => {
    render(
      <SecondaryDataSourceProvider>
        <TestComponent />
      </SecondaryDataSourceProvider>
    );

    expect(screen.getByTestId('targeting-countries').textContent).toBe('0');
    expect(screen.getByTestId('targeting-devices').textContent).toBe('0');

    act(() => {
      screen.getByTestId('add-country').click();
    });

    expect(screen.getByTestId('targeting-countries').textContent).toBe('1');

    act(() => {
      screen.getByTestId('add-device').click();
    });

    expect(screen.getByTestId('targeting-devices').textContent).toBe('1');
  });

  test('secondaryDataSourceActions exports the correct action types', () => {
    expect(secondaryDataSourceActions).toEqual({
      UPDATE_FIELD: 'UPDATE_FIELD',
      SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
      SET_SUBMITTING: 'SET_SUBMITTING',
      SET_SUBMITTED: 'SET_SUBMITTED',
      RESET_FORM: 'RESET_FORM',
      SET_FIELD_LOADING: 'SET_FIELD_LOADING',
      UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS'
    });
  });

  test('throws error when useSecondaryDataSource is used outside of SecondaryDataSourceProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSecondaryDataSource must be used within a SecondaryDataSourceProvider');

    // Restore console.error
    console.error = originalError;
  });
});
