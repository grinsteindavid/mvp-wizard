import styled from 'styled-components';

// Styled components for form elements
export const FieldContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
  
  .required-indicator {
    color: #e53935;
    font-weight: bold;
  }
  
  .description-indicator {
    color: white;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4285f4;
    font-size: 12px;
    cursor: help;
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 10;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.disabled ? '#f8f8f8' : 'white'};
  line-height: 1.5;
  
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#4285f4'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.1)' : 'rgba(66, 133, 244, 0.1)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  color: #333;
  font-family: inherit;
  margin: 0;
  
  &::placeholder {
    color: #757575;
    font-style: italic;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#4285f4'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.1)' : 'rgba(66, 133, 244, 0.1)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;


export const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: all 0.2s ease-in-out;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#4285f4'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.1)' : 'rgba(66, 133, 244, 0.1)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background-color: #f8f8f8;
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  
  &:focus {
    outline: 2px solid rgba(66, 133, 244, 0.4);
    outline-offset: 1px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-right: 10px;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  
  &:focus {
    outline: 2px solid rgba(66, 133, 244, 0.4);
    outline-offset: 1px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 0;
  transition: all 0.15s ease;
  position: relative;
  border-radius: 4px;
  
  &:hover {
    color: #4285f4;
    background-color: rgba(66, 133, 244, 0.05);
    padding-left: 4px;
    padding-right: 4px;
  }
  
  &:active {
    background-color: rgba(66, 133, 244, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${props => props.selected && `
    color: #4285f4;
    font-weight: 500;
  `}
  
  ${props => props.disabled && `
    cursor: not-allowed;
    opacity: 0.6;
    
    &:hover {
      color: inherit;
      background-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }
  `}
`;

export const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  animation: errorAppear 0.3s ease;
  padding: 6px 10px;
  background-color: rgba(229, 57, 53, 0.06);
  border-radius: 4px;
  line-height: 1.4;
  border-left: 3px solid #e53935;
  
  @keyframes errorAppear {
    from { 
      opacity: 0;
      transform: translateY(-5px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:before {
    content: '❗';
    margin-right: 8px;
    font-size: 14px;
    margin-top: 0px;
    flex-shrink: 0;
  }
`;

export const HelpText = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 6px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  
  &:before {
    content: '\u2139\ufe0f';
    margin-right: 6px;
    font-size: 11px;
    opacity: 0.7;
    margin-top: 1px;
  }
`;

export const Button = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.secondary ? '#f5f5f5' : '#4285f4'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: 1px solid ${props => props.secondary ? '#ddd' : '#4285f4'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-left: 2px;
  margin-right: 2px;
  
  &:hover {
    background-color: ${props => props.secondary ? '#e0e0e0' : '#3367d6'};
    border-color: ${props => props.secondary ? '#ccc' : '#3367d6'};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.secondary ? 'rgba(0, 0, 0, 0.05)' : 'rgba(66, 133, 244, 0.25)'};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #bdbdbd;
    border-color: #ddd;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
`;

export const GroupContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 28px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d5d5d5;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #4285f4;
    border-radius: 10px 10px 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 18px;
    margin-bottom: 22px;
  }
`;

export const GroupTitle = styled.h3`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-weight: 500;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #4285f4;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const ArrayContainer = styled.div`
  margin-bottom: 30px;
  position: relative;
  
  /* Improve button positioning at the bottom of the container */
  ${Button} {
    margin-top: 10px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ArrayItemContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
  overflow: hidden; /* Prevent content from spilling outside */
  
  /* Constrain the width of inputs inside ArrayItemContainer */
  input, select, textarea {
    max-width: calc(100% - 10px);
    box-sizing: border-box;
  }
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    border-color: #d5d5d5;
  }
  
  &:last-child {
    margin-bottom: 8px;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ArrayItemActions = styled.div`
  position: absolute;
  top: 8px;
  right: 40px; /* Increased from 8px to leave room for render counter */
  display: flex;
  gap: 8px;
  transition: opacity 0.2s ease;
  opacity: 0.7;
  z-index: 20; /* Ensure it's above other elements */
  
  ${ArrayItemContainer}:hover & {
    opacity: 1;
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => props.danger ? '#e53935' : '#f5f5f5'};
  color: ${props => props.danger ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${props => props.danger ? '#c62828' : '#e0e0e0'};
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.danger ? 'rgba(229, 57, 53, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;
