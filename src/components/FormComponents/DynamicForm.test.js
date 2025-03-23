import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from './DynamicForm';
import Joi from 'joi';

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
      target: { value: 'Jane Doe2' }
    });
    
    expect(handleChange).toHaveBeenCalledWith("name", "Jane Doe2");
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
  
  test('validates fields using validationSchema', () => {
    // Create a mock validation schema using Joi
    const mockValidationSchema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required()
    });
    
    const mockOnValidate = jest.fn();
    
    const fieldsWithValidation = {
      name: {
        type: 'text',
        label: 'Name',
        value: 'Jo',
        fieldPath: 'name'
      },
      email: {
        type: 'email',
        label: 'Email',
        value: 'invalid-email',
        fieldPath: 'email'
      }
    };
    
    render(
      <DynamicForm 
        fields={fieldsWithValidation} 
        onChange={() => {}} 
        errors={{}} 
        onValidate={mockOnValidate}
        validationSchema={mockValidationSchema}
      />
    );
    
    // Trigger validation by blurring the name field
    fireEvent.blur(screen.getByLabelText('Name'));
    
    // Check if onValidate was called with validation results
    expect(mockOnValidate).toHaveBeenCalledWith(
      'name', 
      expect.objectContaining({
        isValid: false,
        error: expect.any(String)
      })
    );
  });
});
