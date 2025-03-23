import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectSetupStep from './ProjectSetupStep';
import { useWizard } from '../../../contexts/WizardContext';
import { dataSourceNames } from '../../../contexts/DataSourceFactory';
import { schemaCreators } from '../../../schemas';

// Mock the necessary dependencies
jest.mock('../../../contexts/WizardContext', () => ({
  useWizard: jest.fn()
}));

jest.mock('../../../schemas', () => {
  const mockSchemaCreators = {
    primary: jest.fn().mockReturnValue({}),
    secondary: jest.fn().mockReturnValue({}),
    tertiary: jest.fn().mockReturnValue({})
  };
  return {
    schemaCreators: mockSchemaCreators
  };
});

jest.mock('../../FormComponents/DynamicForm', () => {
  return function MockDynamicForm(props) {
    return (
      <div data-testid="dynamic-form">
        <button 
          data-testid="test-field-change-button" 
          onClick={() => props.onChange('testField', 'new value')}
        >
          Change Field
        </button>
      </div>
    );
  };
});

describe('ProjectSetupStep Component', () => {
  // Set up common mocks
  const mockPrevStep = jest.fn();
  const mockNextStep = jest.fn();
  const mockDataSource = 'primary';
  const mockUpdateField = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default useWizard mock implementation
    useWizard.mockReturnValue({
      dataSource: mockDataSource,
      prevStep: mockPrevStep,
      nextStep: mockNextStep
    });
    
    // Suppress console logs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('renders error message when data source context is invalid', () => {
    render(<ProjectSetupStep dataSourceContext={null} />);
    
    // Should show error message
    expect(screen.getByText(/Data source context not available/i)).toBeInTheDocument();
    expect(screen.getByText(/Please go back and choose a data source to continue/i)).toBeInTheDocument();
    
    // Back button should be present
    const backButton = screen.getByText('Back to Source Selection');
    expect(backButton).toBeInTheDocument();
    
    // Click back button should call prevStep
    fireEvent.click(backButton);
    expect(mockPrevStep).toHaveBeenCalled();
  });

  test('renders project setup form when data source context is valid', () => {
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: {},
        errors: {}
      },
      updateField: mockUpdateField
    };
    
    render(<ProjectSetupStep dataSourceContext={mockContext} />);
    
    // Check that title includes the data source name
    expect(screen.getByText(`Set Up ${dataSourceNames[mockDataSource]} Project`)).toBeInTheDocument();
    
    // Check that the form is rendered
    expect(screen.getByTestId('dynamic-form')).toBeInTheDocument();
    
    // Check that navigation buttons are rendered
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Review Project')).toBeInTheDocument();
  });

  test('calls updateField when form field changes', () => {
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: {},
        errors: {}
      },
      updateField: mockUpdateField
    };
    
    render(<ProjectSetupStep dataSourceContext={mockContext} />);
    
    // Trigger the field change by clicking the test button in the mocked DynamicForm
    fireEvent.click(screen.getByTestId('test-field-change-button'));
    
    // Check that updateField was called with the expected arguments
    expect(mockUpdateField).toHaveBeenCalledWith('testField', 'new value');
  });

  test('calls prevStep when Back button is clicked', () => {
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: {},
        errors: {}
      },
      updateField: mockUpdateField
    };
    
    render(<ProjectSetupStep dataSourceContext={mockContext} />);
    
    // Click the Back button
    fireEvent.click(screen.getByText('Back'));
    
    // Check that prevStep was called
    expect(mockPrevStep).toHaveBeenCalled();
  });

  test('calls nextStep when Review Project button is clicked', () => {
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: {},
        errors: {}
      },
      updateField: mockUpdateField
    };
    
    render(<ProjectSetupStep dataSourceContext={mockContext} />);
    
    // Click the Review Project button
    fireEvent.click(screen.getByText('Review Project'));
    
    // Check that nextStep was called
    expect(mockNextStep).toHaveBeenCalled();
  });

  test('creates validation schema based on data source', () => {
    // Create a valid context mock
    const mockContext = {
      state: {
        fields: {},
        errors: {}
      },
      updateField: mockUpdateField
    };
    
    // Need to reset schemaCreators mock count before test
    const mockSchemaCreator = schemaCreators[mockDataSource];
    mockSchemaCreator.mockClear();
    
    render(<ProjectSetupStep dataSourceContext={mockContext} />);
    
    // Check that the schema creator was called for the current data source
    expect(mockSchemaCreator).toHaveBeenCalled();
  });
});
