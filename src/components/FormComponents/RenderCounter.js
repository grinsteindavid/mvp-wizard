import React, { useRef } from 'react';
import styled from 'styled-components';

const CounterContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const Counter = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #6200ee;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
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
  
  ${Counter}:hover + & {
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
 * RenderCounter component that displays the number of renders for a component
 * Only appears in development mode
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to wrap with render counter
 * @returns {JSX.Element}
 */
const RenderCounter = ({ children }) => {
  // Use ref to track render count
  const renderCount = useRef(0);
  
  // Increment render count on each render
  renderCount.current += 1;
  
  // Only show in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return children;
  }
  
  return (
    <CounterContainer>
      {children}
      <Counter data-testid="render-counter">
        {renderCount.current}
      </Counter>
      <Tooltip>
        Number of renders for this component. High numbers may indicate performance issues.
      </Tooltip>
    </CounterContainer>
  );
};

export default RenderCounter;
