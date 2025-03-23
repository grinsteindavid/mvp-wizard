import React, { useState } from 'react';
import styled from 'styled-components';
import { FieldContainer, Label, ErrorMessage, HelpText } from '../styled/FormElements';

const DescriptionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  font-size: 12px;
  margin-left: 4px;
  cursor: help;
  vertical-align: middle;
`;

const DescriptionTooltip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  color: #333;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 5;
`;

/**
 * Base component for all field types that handles common field rendering logic
 * 
 * @param {Object} props - Component props
 * @param {Object} props.field - Field configuration
 * @param {React.ReactNode} props.children - Field input element(s)
 * @param {string} props.error - Error message if any
 * @returns {JSX.Element}
 */
const BaseField = ({ field, children, error }) => {
  const [showDescription, setShowDescription] = useState(false);
  
  return (
    <FieldContainer>
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="required-indicator"> *</span>}
        {field.description && (
          <DescriptionIcon
            title={field.description}
            onClick={() => setShowDescription(!showDescription)}
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
          >
            ?
          </DescriptionIcon>
        )}
      </Label>
      
      {showDescription && field.description && (
        <DescriptionTooltip>
          {field.description}
        </DescriptionTooltip>
      )}
      
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {field.helpText && <HelpText>{field.helpText}</HelpText>}
    </FieldContainer>
  );
};

export default BaseField;
