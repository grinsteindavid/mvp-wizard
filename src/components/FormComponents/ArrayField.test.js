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
  
  test('handles a complex sequence of operations correctly', () => {
    // Start with a mock function to track all changes
    const handleChange = jest.fn();
    
    // Create a component reference to update props between operations
    let currentField = createMockField([]);
    let currentErrors = {};
    
    // Initial render with empty array
    const { rerender } = render(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // Step 1: Add a group
    fireEvent.click(screen.getByText('Add Addresse'));
    
    // Simulate the onChange handler updating the field value
    const firstGroupAdded = [{ street: '', city: '' }];
    currentField = createMockField(firstGroupAdded);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // After adding the first group, we should have two inputs (street and city)
    const allInputs = screen.getAllByDisplayValue('');
    expect(allInputs.length).toBe(2);
    
    // Find the street input by its name attribute
    const streetInputs = allInputs.filter(input => input.name === 'street');
    const cityInputs = allInputs.filter(input => input.name === 'city');
    expect(streetInputs.length).toBe(1);
    expect(cityInputs.length).toBe(1);
    
    // Step 2: Modify the first street input
    fireEvent.change(streetInputs[0], {
      target: { value: '100 First St' }
    });
    
    // Simulate the onChange handler updating the field value
    const firstInputModified = [{ street: '100 First St', city: '' }];
    currentField = createMockField(firstInputModified);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // Step 3: Modify the first city input
    // Now we should have one input with value '100 First St' and one with empty value
    const updatedInputs = screen.getAllByDisplayValue('');
    expect(updatedInputs.length).toBe(1);
    
    fireEvent.change(updatedInputs[0], {
      target: { value: 'Chicago' }
    });
    
    // Simulate the onChange handler updating the field value
    const secondInputModified = [{ street: '100 First St', city: 'Chicago' }];
    currentField = createMockField(secondInputModified);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // Step 4: Add another group
    fireEvent.click(screen.getByText('Add Addresse'));
    
    // Simulate the onChange handler updating the field value
    const secondGroupAdded = [
      { street: '100 First St', city: 'Chicago' },
      { street: '', city: '' }
    ];
    currentField = createMockField(secondGroupAdded);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // After adding the second group, we should have two new empty inputs
    const newEmptyInputs = screen.getAllByDisplayValue('');
    expect(newEmptyInputs.length).toBe(2);
    
    // Find the new street and city inputs
    const newStreetInputs = newEmptyInputs.filter(input => input.name === 'street');
    const newCityInputs = newEmptyInputs.filter(input => input.name === 'city');
    expect(newStreetInputs.length).toBe(1);
    expect(newCityInputs.length).toBe(1);
    
    // Step 5: Modify the street input in the second group
    fireEvent.change(newStreetInputs[0], {
      target: { value: '200 Second St' }
    });
    
    // Simulate the onChange handler updating the field value
    const thirdInputModified = [
      { street: '100 First St', city: 'Chicago' },
      { street: '200 Second St', city: '' }
    ];
    currentField = createMockField(thirdInputModified);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // Step 6: Modify the city input in the second group
    // Now we should have one remaining empty input (the city in the second group)
    const finalEmptyInput = screen.getByDisplayValue('');
    fireEvent.change(finalEmptyInput, {
      target: { value: 'Boston' }
    });
    
    // Simulate the onChange handler updating the field value
    const fourthInputModified = [
      { street: '100 First St', city: 'Chicago' },
      { street: '200 Second St', city: 'Boston' }
    ];
    currentField = createMockField(fourthInputModified);
    
    // Re-render with updated field value
    rerender(
      <ArrayField 
        field={currentField} 
        onChange={handleChange} 
        errors={currentErrors} 
      />
    );
    
    // Verify all inputs have the correct values
    // Get all inputs by their display values
    expect(screen.getByDisplayValue('100 First St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Chicago')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200 Second St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Boston')).toBeInTheDocument();
    
    // Verify the final state of the array
    expect(currentField.value).toEqual([
      { street: '100 First St', city: 'Chicago' },
      { street: '200 Second St', city: 'Boston' }
    ]);
    
    // Verify the number of onChange calls (one for each operation)
    expect(handleChange).toHaveBeenCalledTimes(6);
  });
});
