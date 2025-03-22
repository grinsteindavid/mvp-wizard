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
      <div data-testid="project-name">{state.projectName || ''}</div>
      <div data-testid="resource-allocation">{state.resourceAllocation || ''}</div>
      <div data-testid="optimization-strategy">{state.optimizationStrategy || ''}</div>
      <div data-testid="key-terms">{state.keyTerms || ''}</div>
      <div data-testid="category-groups-count">{state.categoryGroups ? state.categoryGroups.length : 0}</div>
      {state.categoryGroups && state.categoryGroups.map((group, index) => (
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
        data-testid="update-resource-allocation" 
        onClick={() => updateField('resourceAllocation', 'high')}
      >
        Update Resource Allocation
      </button>
      <button 
        data-testid="add-category-group" 
        onClick={() => dispatch({ type: primaryDataSourceActions.ADD_CATEGORY_GROUP })}
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
    expect(screen.getByTestId('resource-allocation').textContent).toBe('');
    expect(screen.getByTestId('optimization-strategy').textContent).toBe('');
    expect(screen.getByTestId('key-terms').textContent).toBe('');
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
      screen.getByTestId('update-resource-allocation').click();
    });

    expect(screen.getByTestId('resource-allocation').textContent).toBe('high');
  });

  test('ADD_CATEGORY_GROUP action adds a new category group', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    expect(screen.getByTestId('category-groups-count').textContent).toBe('0');

    act(() => {
      screen.getByTestId('add-category-group').click();
    });

    expect(screen.getByTestId('category-groups-count').textContent).toBe('1');
  });

  test('UPDATE_CATEGORY_GROUP action updates a category group', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    // First add a category group
    act(() => {
      screen.getByTestId('add-category-group').click();
    });

    // Then update it
    act(() => {
      screen.getByTestId('update-category-group').click();
    });

    expect(screen.getByTestId('category-group-0').textContent).toBe('Test Group - ');
  });

  test('REMOVE_CATEGORY_GROUP action removes a category group', () => {
    render(
      <PrimaryDataSourceProvider>
        <TestComponent />
      </PrimaryDataSourceProvider>
    );

    // First add a category group
    act(() => {
      screen.getByTestId('add-category-group').click();
    });

    expect(screen.getByTestId('category-groups-count').textContent).toBe('1');

    // Then remove it
    act(() => {
      screen.getByTestId('remove-category-group').click();
    });

    expect(screen.getByTestId('category-groups-count').textContent).toBe('0');
  });

  test('primaryDataSourceActions exports the correct action types', () => {
    expect(primaryDataSourceActions).toEqual({
      UPDATE_FIELD: 'UPDATE_FIELD',
      SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
      SET_SUBMITTING: 'SET_SUBMITTING',
      SET_SUBMITTED: 'SET_SUBMITTED',
      RESET_FORM: 'RESET_FORM',
      ADD_CATEGORY_GROUP: 'ADD_CATEGORY_GROUP',
      REMOVE_CATEGORY_GROUP: 'REMOVE_CATEGORY_GROUP',
      UPDATE_CATEGORY_GROUP: 'UPDATE_CATEGORY_GROUP',
      SET_BID_STRATEGIES: 'SET_BID_STRATEGIES',
      SET_FIELD_LOADING: 'SET_FIELD_LOADING',
      UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS'
    });
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
