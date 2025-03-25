import React, { useRef } from 'react';
import styled from 'styled-components';

const CounterContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const Counter = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 9px;
  padding: 1px 3px;
  background-color: rgba(98, 0, 238, 0.1);
  color: #6200ee;
  border-radius: 0 4px 0 4px;
  z-index: 10;
  font-family: monospace;
  cursor: help;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  background-color: #f9f9f9;
  color: #333;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  width: 180px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 11;
  
  ${Counter}:hover + & {
    visibility: visible;
    opacity: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -4px;
    right: 5px;
    width: 8px;
    height: 8px;
    background-color: #f9f9f9;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    transform: rotate(45deg);
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
        Developer info: Component render count. High values may indicate performance issues.
      </Tooltip>
    </CounterContainer>
  );
};

export default RenderCounter;
