import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArrayField from './ArrayField';

describe('ArrayField', () => {
  const mockValues = [
    { street: '123 Main St', city: 'New York' },
    { street: '456 Oak Ave', city: 'Los Angeles' }
  ];
  
  const createMockField = (value = []) => ({
    type: 'array',
    name: 'addresses',
    label: 'Addresses',
    value: value,
    fields: {
      street: {
        type: 'text',
        name: 'street',
        label: 'Street'
      },
      city: {
        type: 'text',
        name: 'city',
        label: 'City'
      }
    }
  });
  
  test('renders array title and items', () => {
    render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByText('Addresses')).toBeInTheDocument();
    // Just check if at least one Street and City label exists
    expect(screen.getAllByText('Street')[0]).toBeInTheDocument();
    expect(screen.getAllByText('City')[0]).toBeInTheDocument();
  });
  
  test('displays item values correctly', () => {
    render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    // Just check the first item values
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
  });
  
  test('adds a new item when Add button is clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    fireEvent.click(screen.getByText('Add Addresse'));
    
    expect(handleChange).toHaveBeenCalledWith('addresses', [
      ...mockValues,
      { street: '', city: '' }
    ]);
  });
  
  test('removes an item when Remove button is clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    // Click the first remove button (×)
    fireEvent.click(screen.getAllByText('×')[0]);
    
    expect(handleChange).toHaveBeenCalledWith('addresses', [
      { street: '456 Oak Ave', city: 'Los Angeles' }
    ]);
  });
  
  test('updates an item field when its value changes', () => {
    const handleChange = jest.fn();
    
    render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    fireEvent.change(screen.getAllByDisplayValue('123 Main St')[0], {
      target: { value: '789 Pine St' }
    });
    
    // The component updates the entire array with the modified item
    expect(handleChange).toHaveBeenCalledWith('addresses', [
      { street: '789 Pine St', city: 'New York' },
      { street: '456 Oak Ave', city: 'Los Angeles' }
    ]);
  });

  test('correctly handles multiple field changes in the same item', () => {
    // Mock the onChange handler
    const handleChange = jest.fn();
    
    // Render the component with initial values
    const { rerender } = render(
      <ArrayField 
        field={createMockField(mockValues)} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    // Change the street field first
    fireEvent.change(screen.getAllByDisplayValue('123 Main St')[0], {
      target: { value: '789 Pine St' }
    });
    
    // Get the updated values from the onChange call
    const updatedValues = handleChange.mock.calls[0][1];
    
    // Verify the street was updated correctly in the onChange call
    expect(updatedValues[0].street).toBe('789 Pine St');
    
    // Rerender with the updated values (simulating parent component update)
    rerender(
      <ArrayField 
        field={createMockField(updatedValues)} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    // Reset the mock to track the next change
    handleChange.mockClear();
    
    // Now change the city field
    fireEvent.change(screen.getAllByDisplayValue('New York')[0], {
      target: { value: 'San Francisco' }
    });
    
    // Get the updated values from the second onChange call
    const finalValues = handleChange.mock.calls[0][1];
    
    // Verify both changes were preserved in the onChange call
    expect(finalValues[0].street).toBe('789 Pine St');
    expect(finalValues[0].city).toBe('San Francisco');
  });
});
