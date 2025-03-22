import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from './DynamicForm';

describe('DynamicForm', () => {
  const mockFields = {
    name: {
      type: 'text',
      label: 'Name'
    },
    email: {
      type: 'email',
      label: 'Email'
    },
    contactInfo: {
      type: 'group',
      label: 'Contact Information',
      fields: {
        phone: {
          type: 'text',
          label: 'Phone'
        },
        address: {
          type: 'text',
          label: 'Address'
        }
      }
    },
    hobbies: {
      type: 'array',
      label: 'Hobbies',
      fields: {
        name: {
          type: 'text',
          label: 'Hobby Name'
        },
        years: {
          type: 'number',
          label: 'Years'
        }
      }
    }
  };
  
  const mockValues = {
    name: 'John Doe',
    email: 'john@example.com',
    contactInfo: {
      phone: '555-1234',
      address: '123 Main St'
    },
    hobbies: [
      { name: 'Reading', years: 10 }
    ]
  };
  
  test('renders all field types correctly', () => {
    render(
      <DynamicForm 
        fields={mockFields} 
        values={mockValues} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    // Regular fields
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    
    // Group fields
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    
    // Array fields
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
    expect(screen.getByLabelText('Hobby Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Years')).toBeInTheDocument();
  });
  
  test('displays field values correctly', () => {
    render(
      <DynamicForm 
        fields={mockFields} 
        values={mockValues} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Phone')).toHaveValue('555-1234');
    expect(screen.getByLabelText('Address')).toHaveValue('123 Main St');
    expect(screen.getByLabelText('Hobby Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Years')).toHaveValue(10);
  });
  
  test('calls onChange with updated values when field changes', () => {
    const handleChange = jest.fn();
    
    render(
      <DynamicForm 
        fields={mockFields} 
        values={mockValues} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane Doe' }
    });
    
    // Extract the callback function that was passed to handleChange
    const callback = handleChange.mock.calls[0][0];
    
    // Execute the callback with the current values to get the actual result
    const result = callback(mockValues);
    
    // Verify the result matches our expectations
    expect(result).toEqual({
      ...mockValues,
      name: 'Jane Doe'
    });
  });
  
  test('displays error messages correctly', () => {
    const errors = {
      name: 'Name is required',
      'contactInfo.phone': 'Invalid phone number'
    };
    
    render(
      <DynamicForm 
        fields={mockFields} 
        values={mockValues} 
        onChange={() => {}} 
        errors={errors} 
      />
    );
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });
  
  test('displays message when no fields are available', () => {
    render(
      <DynamicForm 
        fields={null} 
        values={{}} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByText('No form fields available')).toBeInTheDocument();
  });
});
