import styled from 'styled-components';

// Styled components for form elements
export const FieldContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
  
  .required-indicator {
    color: #e53935;
    font-weight: bold;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#4285f4'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.2)' : 'rgba(66, 133, 244, 0.2)'};
  }
`;

export const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 4px;
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
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.2)' : 'rgba(66, 133, 244, 0.2)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  ${props => props.hasError && `
    background-color: rgba(229, 57, 53, 0.03);
  `}
`;


export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ddd'};
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53935' : '#4285f4'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(229, 57, 53, 0.2)' : 'rgba(66, 133, 244, 0.2)'};
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
`;

export const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-right: 8px;
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
`;

export const HelpText = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
`;

export const Button = styled.button`
  padding: 10px 16px;
  background-color: ${props => props.secondary ? '#f5f5f5' : '#4285f4'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: 1px solid ${props => props.secondary ? '#ddd' : '#4285f4'};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.secondary ? '#e0e0e0' : '#3367d6'};
    border-color: ${props => props.secondary ? '#ccc' : '#3367d6'};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #bdbdbd;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
`;

export const GroupContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
`;

export const GroupTitle = styled.h3`
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

export const ArrayContainer = styled.div`
  margin-bottom: 20px;
`;

export const ArrayItemContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  position: relative;
`;

export const ArrayItemActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background-color: ${props => props.danger ? '#e53935' : '#f5f5f5'};
  color: ${props => props.danger ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: ${props => props.danger ? '#c62828' : '#e0e0e0'};
  }
`;
