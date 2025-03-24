import React, { useEffect, useMemo, memo } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { DataSourceFactory } from '../../contexts/DataSourceFactory';
import { WIZARD_STEPS } from './constants';
import SourceSelectionStep from './Steps/SourceSelectionStep';
import ProjectSetupStep from './Steps/ProjectSetupStep';
import ReviewStep from './Steps/ReviewStep';
import {
  WizardContainer,
  WizardHeader,
  WizardTitle,
  StepIndicator,
  StepItem,
  StepNumber,
  StepLabel,
  StepConnector,
  WizardContent
} from './styled/WizardElements';

/**
 * Main Wizard component that manages the wizard flow and steps
 */
const Wizard = () => {
  // Get all the necessary state from the wizard context
  const { currentStep, dataSource, setStep } = useWizard();

  // Check if data source is selected
  const isDataSourceSelected = !!dataSource;

  // Effect to redirect to step 0 if no data source is selected and we're not on step 0
  useEffect(() => {
    if (!isDataSourceSelected && currentStep > 0) {
      setStep(0);
    }
  }, [isDataSourceSelected, currentStep, setStep]);

  /**
   * Render the step content based on the current step
   * @param {Object} contextValue - The data source context value (if available)
   * @returns {JSX.Element} - The step component to render
   */
  const renderStepContent = (contextValue) => {
    switch (currentStep) {
      case 0:
        // The source selection step doesn't need a data source context
        return <SourceSelectionStep />;
      case 1:
        // Project setup requires data source context
        return <ProjectSetupStep dataSourceContext={contextValue} />;
      case 2:
        // Review step requires data source context
        return <ReviewStep dataSourceContext={contextValue} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  // Memoize the step indicator to prevent unnecessary re-renders
  const stepIndicator = useMemo(() => (
    <StepIndicator>
      {WIZARD_STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <StepConnector completed={currentStep > index} />
          )}
          
          <StepItem>
            <StepNumber 
              active={currentStep === step.id}
              completed={currentStep > step.id}
            >
              {currentStep > step.id ? '✓' : step.id + 1}
            </StepNumber>
            <StepLabel 
              active={currentStep === step.id}
              completed={currentStep > step.id}
            >
              {step.label}
            </StepLabel>
          </StepItem>
        </React.Fragment>
      ))}
    </StepIndicator>
  ), [currentStep]);

  // Message to show when data source is required but not selected
  const dataSourceRequiredMessage = (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Data Source Required</h2>
      <p>Please choose a data source before proceeding.</p>
      <p>Redirecting to source selection...</p>
    </div>
  );

  return (
    <WizardContainer>
      <WizardHeader>
        <WizardTitle>Workflow Wizard</WizardTitle>
        {stepIndicator}
      </WizardHeader>
      
      <WizardContent>
        {currentStep === 0 ? (
          // Source selection step doesn't need data source context
          <SourceSelectionStep />
        ) : (
          // All other steps require data source context
          isDataSourceSelected ? (
            // Data source is selected, use DataSourceFactory once
            <DataSourceFactory source={dataSource}>
              {(contextValue) => renderStepContent(contextValue)}
            </DataSourceFactory>
          ) : (
            // Data source is required but not selected
            dataSourceRequiredMessage
          )
        )}
      </WizardContent>
    </WizardContainer>
  );
};

// Memoize the entire Wizard component to prevent unnecessary re-renders
export default memo(Wizard);
