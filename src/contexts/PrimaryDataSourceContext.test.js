import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PrimaryDataSourceProvider, usePrimaryDataSource, primaryDataSourceActions } from './PrimaryDataSourceContext';

// Test component that uses the Primary data source context
const TestComponent = () => {
  const { 
    state, 
    updateField, 
    dispatch 
  } = usePrimaryDataSource();

  return (
    <div>
      <div data-testid="project-name">{state.fields.projectName?.value || ''}</div>
      <div data-testid="daily-budget">{state.fields.dailyBudget?.value || ''}</div>
      <div data-testid="bid-strategy">{state.fields.bidStrategy?.value || ''}</div>
      <div data-testid="keywords">{state.fields.keywords?.value || ''}</div>
      <div data-testid="category-groups-count">{state.fields.categoryGroups?.value?.length || 0}</div>
      {state.fields.categoryGroups?.value && state.fields.categoryGroups.value.map((group, index) => (
        <div key={index} data-testid={`category-group-${index}`}>
          {group.name} - {group.value}
        </div>
      ))}
      <button 
        data-testid="update-project-name" 
        onClick={() => updateField('projectName', 'Primary Test Project')}
      >
        Update Project Name
      </button>
      <button 
        data-testid="update-daily-budget" 
        onClick={() => updateField('dailyBudget', '5000')}
      >
        Update Daily Budget
      </button>
      <button 
        data-testid="add-category-group" 
        onClick={() => dispatch({ 
          type: primaryDataSourceActions.UPDATE_FIELD, 
          field: 'categoryGroups', 
          value: [{ name: 'Default Category', value: '123' }] 
        })}
      >
        Add Category Group
      </button>
      <button 
        data-testid="update-category-group" 
        onClick={() => {
          if (state.categoryGroups && state.categoryGroups.length > 0) {
            dispatch({ 
              type: primaryDataSourceActions.UPDATE_CATEGORY_GROUP, 
              index: 0, 
              field: 'name', 
              value: 'Test Group' 
            });
          }
        }}
      >
        Update Category Group
      </button>
      <button 
        data-testid="remove-category-group" 
        onClick={() => {
          if (state.categoryGroups && state.categoryGroups.length > 0) {
            dispatch({ 
              type: primaryDataSourceActions.REMOVE_CATEGORY_GROUP, 
              index: 0 
            });
          }
        }}
      >
        Remove Category Group
      </button>
    </div>
  );
};

describe('PrimaryDataSourceContext', () => {
  test('provides initial state values', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    expect(screen.getByTestId('project-name').textContent).toBe('');
    expect(screen.getByTestId('daily-budget').textContent).toBe('');
    expect(screen.getByTestId('bid-strategy').textContent).toBe('');
    expect(screen.getByTestId('keywords').textContent).toBe('');
    expect(screen.getByTestId('category-groups-count').textContent).toBe('0');
  });

  test('updateField updates a field value', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    act(() => {
      screen.getByTestId('update-project-name').click();
    });

    expect(screen.getByTestId('project-name').textContent).toBe('Primary Test Project');

    act(() => {
      screen.getByTestId('update-daily-budget').click();
    });

    expect(screen.getByTestId('daily-budget').textContent).toBe('5000');
  });

  test('Category groups field exists in initial state', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    // Verify the categoryGroups field is initialized with an empty array
    expect(screen.getByTestId('category-groups-count').textContent).toBe('0');
  });

  test('TestComponent rendering with category groups count', () => {
    // Test that the component renders the proper data-testid elements
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );
    
    // Category groups count starts at 0
    expect(screen.getByTestId('category-groups-count')).toBeInTheDocument();
    expect(screen.getByTestId('add-category-group')).toBeInTheDocument();
  });

  test('Empty category groups array is handled correctly', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    expect(screen.getByTestId('category-groups-count').textContent).toBe('0');
  });

  test('primaryDataSourceActions exports the correct action types', () => {
    // Check for the correct action names from baseReducerActions
    expect(primaryDataSourceActions.UPDATE_FIELD_VALUE).toBeDefined();
    expect(primaryDataSourceActions.SET_VALIDATION_RESULT).toBeDefined();
    expect(primaryDataSourceActions.SET_SUBMITTING).toBeDefined();
    expect(primaryDataSourceActions.SET_SUBMITTED).toBeDefined();
    expect(primaryDataSourceActions.RESET_FORM).toBeDefined();
    expect(primaryDataSourceActions.SET_FIELD_LOADING).toBeDefined();
    expect(primaryDataSourceActions.UPDATE_FIELD_OPTIONS).toBeDefined();
  });

  test('throws error when usePrimaryDataSource is used outside of PrimaryDataSourceProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePrimaryDataSource must be used within a PrimaryDataSourceProvider');

    // Restore console.error
    console.error = originalError;
  });
});
