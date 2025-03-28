import React, { useState, useMemo } from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import { dataSourceNames } from '../../../contexts/DataSourceFactory';
import { validateProject } from '../../../services/validationService';
import ReviewFieldRenderer from '../components/ReviewFieldRenderer';
import { prepareFieldValue, transformFieldsForValidation } from '../utils/formatHelpers';
import {
  StepContainer,
  Title,
  ReviewSection,
  SectionTitle,
  ButtonContainer,
  Button,
  SuccessMessage,
  ErrorContainer,
  ErrorTitle,
  ErrorList,
  ErrorItem
} from '../styled/WizardElements';

/**
 * Final step of the wizard to review project details and submit
 * @param {object} dataSourceContext - Context from the data source provider
 */
const ReviewStep = ({ dataSourceContext }) => {
  const { dataSource: sourceId, prevStep, resetWizard } = useWizard();
  const [validationErrors, setValidationErrors] = useState(null);
  
  // Access the data source context that was passed via props from the parent
  const currentSource = dataSourceContext;

  /**
   * Handle project submission
   */
  const handleSubmit = () => {
    // Set submitting state in the data source context
    currentSource.setSubmitting(true);
    
    // Check if the data source context has project data
    if (!currentSource || !currentSource.state) {
      currentSource.setSubmitting(false);
      setValidationErrors({ general: 'No project data available' });
      return;
    }

    // Transform fields to the format expected by validation schema
    // using the utility function
    const transformedData = transformFieldsForValidation(currentSource.state.fields);
    
    console.log('Transformed data for validation:', transformedData);
    
    // Validate the transformed project data
    const validationResult = validateProject(sourceId, transformedData);
    
    // Use the data source context's setValidationResult
    currentSource.setValidationResult(validationResult);
    
    if (validationResult.isValid) {
      // Simulate API call to create project
      // In a real app, this would be an async API call
      console.log('Project created:', currentSource.state);
      currentSource.setSubmitting(false);
      currentSource.setSubmitted(true);
    } else {
      currentSource.setSubmitting(false);
      setValidationErrors(validationResult.errors);
    }
  };

  /**
   * Handle starting a new project
   */
  const handleStartOver = () => {
    resetWizard();
  };

  // Memoize the field values rendering for better performance
  const preparedFields = useMemo(() => {
    // Safe check for currentSource and its fields
    if (!currentSource || !currentSource.state || !currentSource.state.fields) {
      console.error('Missing data source or fields in ReviewStep');
      return [];
    }
    
    const fields = currentSource.state.fields;
    
    // Log the fields for debugging
    console.log('Fields in ReviewStep:', fields);
    
    return Object.keys(fields).map(fieldName => {
      // For each field, get its value from the field definition itself
      const fieldValue = fields[fieldName].value;
      console.log(`Processing field ${fieldName}:`, { value: fieldValue, definition: fields[fieldName] });
      
      // Prepare the field data for rendering
      return prepareFieldValue(fieldName, fieldValue, fields);
    }).filter(Boolean); // Filter out null entries
  }, [currentSource]);
  
  // If no valid data source is available, show an error message
  if (!currentSource) {
    return (
      <StepContainer>
        <Title>Error</Title>
        <div>Invalid or unavailable data source: {sourceId}</div>
      </StepContainer>
    );
  }
  
  return (
    <StepContainer>
      <Title>Review Your {dataSourceNames[sourceId]} Project</Title>
      
      <ReviewSection>
        <SectionTitle>Project Details</SectionTitle>
        {preparedFields.map(fieldData => (
          <ReviewFieldRenderer key={fieldData.key} fieldData={fieldData} />
        ))}
      </ReviewSection>
      
      {validationErrors && (
        <ErrorContainer>
          <ErrorTitle>Please fix the following errors:</ErrorTitle>
          <ErrorList>
            {Object.values(validationErrors).map((error, index) => (
              <ErrorItem key={index}>{error}</ErrorItem>
            ))}
          </ErrorList>
        </ErrorContainer>
      )}
      
      {currentSource.state.isSubmitted ? (
        <>
          <SuccessMessage>
            Project created successfully!
          </SuccessMessage>
          <ButtonContainer>
            <Button primary onClick={handleStartOver}>
              Create Another Project
            </Button>
          </ButtonContainer>
        </>
      ) : (
        <ButtonContainer>
          <Button onClick={prevStep} disabled={currentSource.state.isSubmitting}>
            Back
          </Button>
          <Button 
            primary 
            onClick={handleSubmit} 
            disabled={currentSource.state.isSubmitting}
          >
            {currentSource.state.isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
        </ButtonContainer>
      )}
    </StepContainer>
  );
};

export default ReviewStep;
