import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormGroup from './FormGroup';

describe('FormGroup', () => {
  const mockField = {
    type: 'group',
    name: 'contactInfo',
    label: 'Contact Information',
    fields: {
      firstName: {
        type: 'text',
        name: 'firstName',
        label: 'First Name',
        value: 'John'  // Add value directly to field definition
      },
      lastName: {
        type: 'text',
        name: 'lastName',
        label: 'Last Name',
        value: 'Doe'   // Add value directly to field definition
      }
    }
  };
  
  const mockValues = {
    firstName: 'John',
    lastName: 'Doe'
  };
  
  test('renders group title and fields', () => {
    render(
      <FormGroup 
        field={mockField} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });
  
  test('displays field values correctly', () => {
    render(
      <FormGroup 
        field={mockField} 
        onChange={() => {}} 
        errors={{}} 
      />
    );
    
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
  });
  
  test('calls onChange with updated group value when field changes', () => {
    const handleChange = jest.fn();
    
    render(
      <FormGroup 
        field={mockField} 
        onChange={handleChange} 
        errors={{}} 
      />
    );
    
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane X' }
    });
    
    expect(handleChange).toHaveBeenCalledWith("contactInfo.firstName", "Jane X");
  });
  
  test('displays field errors correctly', () => {
    const errors = {
      'contactInfo.firstName': 'First name is required'
    };
    
    render(
      <FormGroup 
        field={mockField} 
        values={mockValues} 
        onChange={() => {}} 
        errors={errors} 
      />
    );
    
    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });
});
