import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewStep from './ReviewStep';
import { useWizard } from '../../../contexts/WizardContext';
import { dataSourceNames } from '../../../contexts/DataSourceFactory';
import { validateProject } from '../../../services/validationService';
import { transformFieldsForValidation } from '../utils/formatHelpers';

// Mock the necessary dependencies
jest.mock('../../../contexts/WizardContext', () => ({
  useWizard: jest.fn()
}));

jest.mock('../../../services/validationService', () => ({
  validateProject: jest.fn()
}));

jest.mock('../utils/formatHelpers', () => ({
  transformFieldsForValidation: jest.fn(),
  prepareFieldValue: jest.fn().mockImplementation((name, value) => ({
    type: 'simple',
    key: name,
    label: `Label for ${name}`,
    value: String(value)
  }))
}));

jest.mock('../components/ReviewFieldRenderer', () => {
  return function MockReviewFieldRenderer({ fieldData }) {
    return (
      <div data-testid="review-field-renderer">
        {fieldData.label}: {fieldData.value}
      </div>
    );
  };
});

describe('ReviewStep Component', () => {
  // Set up common mocks
  const mockPrevStep = jest.fn();
  const mockResetWizard = jest.fn();
  const mockDataSource = 'primary';
  const mockSetSubmitting = jest.fn();
  const mockSetSubmitted = jest.fn();
  const mockSetValidationResult = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default useWizard mock implementation
    useWizard.mockReturnValue({
      dataSource: mockDataSource,
      prevStep: mockPrevStep,
      resetWizard: mockResetWizard
    });
    
    // Default transformFieldsForValidation mock
    transformFieldsForValidation.mockReturnValue({
      name: 'Test Project',
      budget: 1000
    });
    
    // Suppress console logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders error message when data source context is invalid', () => {
    render(<ReviewStep dataSourceContext={null} />);
    
    // Should show error message
    expect(screen.getByText(/Invalid or unavailable data source/i)).toBeInTheDocument();
  });

  test('renders review page with project details when data source context is valid', () => {
    // Create mock fields
    const mockFields = {
      name: { value: 'Test Project', label: 'Name', type: 'string' },
      budget: { value: 1000, label: 'Budget', type: 'number' }
    };
    
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: mockFields,
        isSubmitted: false,
        isSubmitting: false
      },
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Check that title includes the data source name
    expect(screen.getByText(`Review Your ${dataSourceNames[mockDataSource]} Project`)).toBeInTheDocument();
    
    // Check that the section title is rendered
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    
    // Check for rendered fields (from our mock implementation)
    const renderedFields = screen.getAllByTestId('review-field-renderer');
    expect(renderedFields.length).toBe(2); // We have 2 mock fields
  });

  test('calls validation service and handles successful submission', () => {
    // Mock successful validation
    validateProject.mockReturnValue({
      isValid: true,
      errors: null
    });
    
    // Create mock fields
    const mockFields = {
      name: { value: 'Test Project', label: 'Name', type: 'string' }
    };
    
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: mockFields,
        isSubmitted: false,
        isSubmitting: false
      },
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Click the Create Project button
    fireEvent.click(screen.getByText('Create Project'));
    
    // Check that submission flow was executed correctly
    expect(mockSetSubmitting).toHaveBeenCalledWith(true);
    expect(transformFieldsForValidation).toHaveBeenCalledWith(mockFields);
    expect(validateProject).toHaveBeenCalledWith(mockDataSource, expect.any(Object));
    expect(mockSetValidationResult).toHaveBeenCalledWith({ isValid: true, errors: null });
    expect(mockSetSubmitting).toHaveBeenCalledWith(false);
    expect(mockSetSubmitted).toHaveBeenCalledWith(true);
  });

  test('displays validation errors when validation fails', () => {
    // Mock failed validation
    const mockErrors = {
      name: 'Name is required',
      budget: 'Budget must be a positive number'
    };
    
    validateProject.mockReturnValue({
      isValid: false,
      errors: mockErrors
    });
    
    // Create mock fields
    const mockFields = {
      name: { value: '', label: 'Name', type: 'string' },
      budget: { value: -100, label: 'Budget', type: 'number' }
    };
    
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: mockFields,
        isSubmitted: false,
        isSubmitting: false
      },
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Click the Create Project button
    fireEvent.click(screen.getByText('Create Project'));
    
    // Check that validation error flow was executed correctly
    expect(mockSetSubmitting).toHaveBeenCalledWith(true);
    expect(validateProject).toHaveBeenCalled();
    expect(mockSetValidationResult).toHaveBeenCalled();
    expect(mockSetSubmitting).toHaveBeenCalledWith(false);
    
    // Error container should be present
    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument();
    
    // Error messages should be displayed
    Object.values(mockErrors).forEach(error => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  test('shows success message and restart button after successful submission', () => {
    // Create a valid context mock with isSubmitted=true
    const mockContext = {
      state: {
        fields: {},
        isSubmitted: true,
        isSubmitting: false
      },
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Success message should be displayed
    expect(screen.getByText('Project created successfully!')).toBeInTheDocument();
    
    // Create Another Project button should be displayed
    const createAnotherButton = screen.getByText('Create Another Project');
    expect(createAnotherButton).toBeInTheDocument();
    
    // Click the button should call resetWizard
    fireEvent.click(createAnotherButton);
    expect(mockResetWizard).toHaveBeenCalled();
  });

  test('disables buttons when submission is in progress', () => {
    // Create a valid context mock with isSubmitting=true
    const mockContext = {
      state: {
        fields: {},
        isSubmitted: false,
        isSubmitting: true
      },
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Back button should be disabled
    expect(screen.getByText('Back')).toBeDisabled();
    
    // Create Project button should be disabled and show loading text
    const createButton = screen.getByText('Creating Project...');
    expect(createButton).toBeDisabled();
  });

  test('handleSubmit sets validation errors when no project data available', async () => {
    // Create an invalid context mock with no state property
    const mockContext = {
      setSubmitting: mockSetSubmitting,
      setSubmitted: mockSetSubmitted,
      setValidationResult: mockSetValidationResult
    };
    
    render(<ReviewStep dataSourceContext={mockContext} />);
    
    // Click the Create Project button
    fireEvent.click(screen.getByText('Create Project'));
    
    // Should set submitting to false and show error
    expect(mockSetSubmitting).toHaveBeenCalledWith(false);
    
    // Error container should be present with general error
    // Use async/await with waitFor to properly wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument();
      expect(screen.getByText('No project data available')).toBeInTheDocument();
    });
  });
});
