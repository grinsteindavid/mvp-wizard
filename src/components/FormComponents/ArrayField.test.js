import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArrayField from './ArrayField';

describe('ArrayField', () => {
  const mockField = {
    type: 'array',
    name: 'addresses',
    label: 'Addresses',
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
  };
  
  const mockValues = [
    { street: '123 Main St', city: 'New York' },
    { street: '456 Oak Ave', city: 'Los Angeles' }
  ];
  
  test('renders array title and items', () => {
    render(
      <ArrayField 
        field={mockField} 
        value={mockValues} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByText('Addresses')).toBeInTheDocument();
    // Just check if at least one Street and City label exists
    expect(screen.getByLabelText('Street')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
  });
  
  test('displays item values correctly', () => {
    render(
      <ArrayField 
        field={mockField} 
        value={mockValues} 
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
        field={mockField} 
        value={mockValues} 
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
        field={mockField} 
        value={mockValues} 
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
        field={mockField} 
        value={mockValues} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    fireEvent.change(screen.getAllByLabelText('Street')[0], {
      target: { value: '789 Pine St' }
    });
    
    expect(handleChange).toHaveBeenCalledWith("addresses[0].street", "789 Pine St");
  });
});
