import React, { useRef } from 'react';
import styled from 'styled-components';

const CounterContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const Counter = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #6200ee;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -25px;
  right: -20px;
  background-color: #f9f9f9;
  color: #333;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  width: 120px;
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
    bottom: -4px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #f9f9f9;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
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
        Renders: {renderCount.current}
      </Tooltip>
    </CounterContainer>
  );
};

export default RenderCounter;
