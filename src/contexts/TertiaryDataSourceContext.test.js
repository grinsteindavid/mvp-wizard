import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { TertiaryDataSourceProvider, useTertiaryDataSource, tertiaryDataSourceActions } from './TertiaryDataSourceContext';

// Test component that uses the Tertiary data source context
const TestComponent = () => {
  const { 
    state, 
    updateField, 
    dispatch 
  } = useTertiaryDataSource();

  return (
    <div>
      <div data-testid="project-title">{state.projectName}</div>
      <div data-testid="project-objective">{state.projectObjective}</div>
      <div data-testid="start-date">{state.startDate}</div>
      <div data-testid="end-date">{state.endDate}</div>
      <div data-testid="budget-amount">{state.budget.amount}</div>
      <div data-testid="budget-type">{state.budget.type}</div>
      <div data-testid="bidding-strategy">{state.bidding.strategy}</div>
      <div data-testid="bidding-amount">{state.bidding.amount}</div>
      <button 
        data-testid="update-project-title" 
        onClick={() => updateField('projectName', 'Tertiary Test Project')}
      >
        Update Project Title
      </button>
      <button 
        data-testid="update-project-objective" 
        onClick={() => updateField('projectObjective', 'awareness')}
      >
        Update Project Objective
      </button>
      <button 
        data-testid="update-budget" 
        onClick={() => dispatch({ 
          type: tertiaryDataSourceActions.UPDATE_BUDGET, 
          field: 'amount', 
          value: '500' 
        })}
      >
        Update Budget Amount
      </button>
      <button 
        data-testid="update-budget-type" 
        onClick={() => dispatch({ 
          type: tertiaryDataSourceActions.UPDATE_BUDGET, 
          field: 'type', 
          value: 'daily' 
        })}
      >
        Update Budget Type
      </button>
      <button 
        data-testid="update-bidding" 
        onClick={() => dispatch({ 
          type: tertiaryDataSourceActions.UPDATE_BIDDING, 
          field: 'strategy', 
          value: 'manual' 
        })}
      >
        Update Bidding Strategy
      </button>
    </div>
  );
};

describe('TertiaryDataSourceContext', () => {
  test('provides initial state values', () => {
    render(
      <TertiaryDataSourceProvider>
        <TestComponent />
      </TertiaryDataSourceProvider>
    );

    expect(screen.getByTestId('project-title').textContent).toBe('');
    expect(screen.getByTestId('project-objective').textContent).toBe('');
    expect(screen.getByTestId('start-date').textContent).toBe('');
    expect(screen.getByTestId('end-date').textContent).toBe('');
    expect(screen.getByTestId('budget-amount').textContent).toBe('');
    expect(screen.getByTestId('budget-type').textContent).toBe('');
    expect(screen.getByTestId('bidding-strategy').textContent).toBe('');
    expect(screen.getByTestId('bidding-amount').textContent).toBe('');
  });

  test('updateField updates a field value', () => {
    render(
      <TertiaryDataSourceProvider>
        <TestComponent />
      </TertiaryDataSourceProvider>
    );

    act(() => {
      screen.getByTestId('update-project-title').click();
    });

    expect(screen.getByTestId('project-title').textContent).toBe('Tertiary Test Project');

    act(() => {
      screen.getByTestId('update-project-objective').click();
    });

    expect(screen.getByTestId('project-objective').textContent).toBe('awareness');
  });

  test('UPDATE_BUDGET and UPDATE_BIDDING actions update nested fields', () => {
    render(
      <TertiaryDataSourceProvider>
        <TestComponent />
      </TertiaryDataSourceProvider>
    );

    // Test budget amount update
    act(() => {
      screen.getByTestId('update-budget').click();
    });

    expect(screen.getByTestId('budget-amount').textContent).toBe('500');

    // Test budget type update
    act(() => {
      screen.getByTestId('update-budget-type').click();
    });

    expect(screen.getByTestId('budget-type').textContent).toBe('daily');

    // Test bidding strategy update
    act(() => {
      screen.getByTestId('update-bidding').click();
    });

    expect(screen.getByTestId('bidding-strategy').textContent).toBe('manual');
  });

  test('tertiaryDataSourceActions exports the correct action types', () => {
    expect(tertiaryDataSourceActions).toEqual({
      UPDATE_FIELD: 'UPDATE_FIELD',
      SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
      SET_SUBMITTING: 'SET_SUBMITTING',
      SET_SUBMITTED: 'SET_SUBMITTED',
      RESET_FORM: 'RESET_FORM',
      UPDATE_BUDGET: 'UPDATE_BUDGET',
      UPDATE_BIDDING: 'UPDATE_BIDDING',
      SET_OBJECTIVES: 'SET_OBJECTIVES',
      SET_BUDGET_TYPES: 'SET_BUDGET_TYPES',
      SET_BIDDING_STRATEGIES: 'SET_BIDDING_STRATEGIES',
      SET_FIELD_LOADING: 'SET_FIELD_LOADING',
      UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS'
    });
  });

  test('throws error when useTertiaryDataSource is used outside of TertiaryDataSourceProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTertiaryDataSource must be used within a TertiaryDataSourceProvider');

    // Restore console.error
    console.error = originalError;
  });
});
