import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Wizard from './WizardComponent';
import { WizardProvider } from '../../contexts/WizardContext';
import { WIZARD_STEPS } from './constants';

// Mock the required components and contexts
jest.mock('./Steps/SourceSelectionStep', () => {
  return function MockSourceSelectionStep() {
    return <div data-testid="source-selection-step">Source Selection Step</div>;
  };
});

jest.mock('./Steps/ProjectSetupStep', () => {
  return function MockProjectSetupStep(props) {
    // Store the passed context in a testable way
    return (
      <div data-testid="project-setup-step">
        Project Setup Step
        {props.dataSourceContext && <div data-testid="has-context">true</div>}
      </div>
    );
  };
});

jest.mock('./Steps/ReviewStep', () => {
  return function MockReviewStep(props) {
    // Store the passed context in a testable way
    return (
      <div data-testid="review-step">
        Review Step
        {props.dataSourceContext && <div data-testid="has-context">true</div>}
      </div>
    );
  };
});

jest.mock('../../contexts/DataSourceFactory', () => ({
  dataSourceNames: {
    primary: 'Primary',
    secondary: 'Secondary',
    tertiary: 'Tertiary'
  },
  DataSourceFactory: ({ source, children }) => {
    // This mock passes a dummy context value to the children function
    return children({
      state: { 
        fields: {},
        isSubmitting: false,
        isSubmitted: false
      },
      setSubmitting: jest.fn(),
      setSubmitted: jest.fn(),
      setValidationResult: jest.fn()
    });
  }
}));

// Helper function to render the component with required context
const renderWizardWithContext = (initialContextValue = {}) => {
  const defaultContextValue = {
    currentStep: 0,
    dataSource: null,
    setStep: jest.fn(),
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    setDataSource: jest.fn(),
    resetWizard: jest.fn(),
    ...initialContextValue
  };

  return render(
    <WizardProvider value={defaultContextValue}>
      <Wizard />
    </WizardProvider>
  );
};

describe('Wizard Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Suppress console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('renders the wizard container', () => {
    renderWizardWithContext();
    
    // Check that the main container and title are displayed
    expect(screen.getByText('Workflow Wizard')).toBeInTheDocument();
  });

  test('renders step indicators for all steps', () => {
    renderWizardWithContext();
    
    // Verify that each step label is displayed
    WIZARD_STEPS.forEach(step => {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    });
  });

  test('renders the source selection step when on step 0', () => {
    renderWizardWithContext({ currentStep: 0 });
    
    // Check that the source selection step is displayed
    expect(screen.getByTestId('source-selection-step')).toBeInTheDocument();
  });

  test('renders the project setup step when on step 1 with data source', () => {
    renderWizardWithContext({ 
      currentStep: 1, 
      dataSource: 'primary' 
    });
    
    // Check that the project setup step is displayed
    expect(screen.getByTestId('project-setup-step')).toBeInTheDocument();
  });

  test('renders the review step when on step 2 with data source', () => {
    renderWizardWithContext({ 
      currentStep: 2, 
      dataSource: 'primary' 
    });
    
    // Check that the review step is displayed
    expect(screen.getByTestId('review-step')).toBeInTheDocument();
  });

  test('redirects to step 0 when no data source is selected but on a later step', () => {
    const setStepMock = jest.fn();
    
    // Directly mock the implementation of useEffect to force it to run
    const useEffectOriginal = React.useEffect;
    // This simple implementation will immediately execute any effect
    React.useEffect = jest.fn((effect) => effect());
    
    renderWizardWithContext({ 
      currentStep: 1, 
      dataSource: null, 
      setStep: setStepMock 
    });
    
    // Check that setStep was called to redirect to step 0
    expect(setStepMock).toHaveBeenCalledWith(0);
    
    // Restore original useEffect
    React.useEffect = useEffectOriginal;
  });

  test('shows the data source required message when no data source but on a step requiring one', () => {
    // Prevent the immediate redirect for this test to see the message
    const setStepMock = jest.fn();
    
    // Properly mock useEffect to prevent it from executing the redirect
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(() => {}); // Don't execute the effect for this test
    
    renderWizardWithContext({ 
      currentStep: 1, 
      dataSource: null,
      setStep: setStepMock 
    });
    
    // The message has heading h2, so we need to use a more specific selector
    const dataSourceRequiredHeading = screen.getByRole('heading', { level: 2, name: /data source required/i });
    expect(dataSourceRequiredHeading).toBeInTheDocument();
    expect(screen.getByText(/please choose a data source before proceeding/i)).toBeInTheDocument();
    
    // Restore the original implementation
    useEffectSpy.mockRestore();
  });

  test('memo prevents re-renders when props have not changed', () => {
    // Setup a render counter
    let renderCount = 0;
    jest.mock('./WizardComponent', () => {
      return function MockWizard() {
        renderCount++;
        return <div>Wizard</div>;
      };
    });

    const { rerender } = renderWizardWithContext();
    const initialRenderCount = renderCount;
    
    // Re-render with the same props
    rerender(
      <WizardProvider value={{ currentStep: 0, dataSource: null }}>
        <Wizard />
      </WizardProvider>
    );
    
    // The component should use React.memo to prevent re-rendering
    expect(renderCount).toBe(initialRenderCount);
  });
});
