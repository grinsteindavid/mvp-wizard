import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  DataSourceFactory, 
  dataSourceNames, 
  dataSourceDescriptions, 
  availableDataSources 
} from './DataSourceFactory';

// Test component that receives context from the factory
const TestConsumer = ({ contextValue }) => {
  if (!contextValue) return <div>No context provided</div>;
  
  return (
    <div>
      <div data-testid="has-context">true</div>
      <div data-testid="has-state">{contextValue.state ? 'true' : 'false'}</div>
      <div data-testid="has-fields">{contextValue.state && contextValue.state.fields ? 'true' : 'false'}</div>
      <div data-testid="has-update-field">{typeof contextValue.updateField === 'function' ? 'true' : 'false'}</div>
    </div>
  );
};

describe('DataSourceFactory', () => {
  test('renders Primary data source component when source is "primary"', () => {
    render(
      <DataSourceFactory source="primary">
        {(contextValue) => <TestConsumer contextValue={contextValue} />}
      </DataSourceFactory>
    );

    expect(screen.getByTestId('has-context').textContent).toBe('true');
    expect(screen.getByTestId('has-state').textContent).toBe('true');
    expect(screen.getByTestId('has-fields').textContent).toBe('true');
    expect(screen.getByTestId('has-update-field').textContent).toBe('true');
  });

  test('renders Secondary data source component when source is "secondary"', () => {
    render(
      <DataSourceFactory source="secondary">
        {(contextValue) => <TestConsumer contextValue={contextValue} />}
      </DataSourceFactory>
    );

    expect(screen.getByTestId('has-context').textContent).toBe('true');
    expect(screen.getByTestId('has-state').textContent).toBe('true');
    expect(screen.getByTestId('has-fields').textContent).toBe('true');
  });

  test('renders Tertiary data source component when source is "tertiary"', () => {
    render(
      <DataSourceFactory source="tertiary">
        {(contextValue) => <TestConsumer contextValue={contextValue} />}
      </DataSourceFactory>
    );

    expect(screen.getByTestId('has-context').textContent).toBe('true');
    expect(screen.getByTestId('has-state').textContent).toBe('true');
    expect(screen.getByTestId('has-fields').textContent).toBe('true');
  });

  test('renders error message for unknown data source', () => {
    render(
      <DataSourceFactory source="unknown">
        {(contextValue) => <TestConsumer contextValue={contextValue} />}
      </DataSourceFactory>
    );

    expect(screen.getByText('Invalid data source: unknown')).toBeInTheDocument();
  });

  test('renders error message when children is not a function', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <DataSourceFactory source="primary">
        <div>Not a function</div>
      </DataSourceFactory>
    );

    expect(screen.getByText('Error: DataSourceFactory requires a function as children')).toBeInTheDocument();

    // Restore console.error
    console.error = originalError;
  });

  test('dataSourceNames contains the correct names', () => {
    expect(dataSourceNames).toEqual({
      primary: 'Primary Integration',
      secondary: 'Content Discovery',
      tertiary: 'Network Integration'
    });
  });

  test('dataSourceDescriptions contains the correct descriptions', () => {
    expect(dataSourceDescriptions).toEqual({
      primary: 'Create projects for search and display networks',
      secondary: 'Native discovery platform for content recommendation',
      tertiary: 'Search and discovery on network properties'
    });
  });

  test('availableDataSources contains all data sources with correct data', () => {
    expect(availableDataSources).toEqual([
      {
        id: 'primary',
        name: dataSourceNames.primary,
        description: dataSourceDescriptions.primary
      },
      {
        id: 'secondary',
        name: dataSourceNames.secondary,
        description: dataSourceDescriptions.secondary
      },
      {
        id: 'tertiary',
        name: dataSourceNames.tertiary,
        description: dataSourceDescriptions.tertiary
      }
    ]);
  });
});
