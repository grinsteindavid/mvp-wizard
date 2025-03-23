import React from 'react';
import styled from 'styled-components';

const IndicatorContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const Indicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: help;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
  width: 200px;
  z-index: 11;
  
  ${Indicator}:hover + & {
    visibility: visible;
    opacity: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 10px;
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: #333 transparent transparent;
  }
`;

/**
 * DescriptionIndicator component that displays a help icon with description tooltip
 * Styled to match the RenderCounter component positioning
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to wrap with description indicator
 * @param {string} props.description - The description text to display in the tooltip
 * @returns {JSX.Element}
 */
const DescriptionIndicator = ({ children, description }) => {
  if (!description) {
    return children;
  }
  
  return (
    <IndicatorContainer>
      {children}
      <Indicator data-testid="description-indicator">
        ?
      </Indicator>
      <Tooltip>
        {description}
      </Tooltip>
    </IndicatorContainer>
  );
};

export default DescriptionIndicator;
