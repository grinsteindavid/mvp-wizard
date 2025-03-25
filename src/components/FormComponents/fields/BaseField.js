import React from 'react';
import { FieldContainer, ErrorMessage } from '../styled/FormElements';

/**
 * Base component for all field types that handles common field rendering logic
 * 
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration
 * @param {React.ReactNode} props.children - Field input element(s)
 * @param {string} props.error - Error message if any
 * @returns {JSX.Element}
 */
const BaseField = ({ children, error }) => {
  
  
  return (
    <FieldContainer>
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FieldContainer>
  );
};

export default BaseField;
