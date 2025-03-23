import styled from 'styled-components';

// Main container for the wizard
export const WizardContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  position: relative;
  
  @media (max-width: 960px) {
    max-width: 95%;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
`;

// Header section of the wizard
export const WizardHeader = styled.div`
  background-color: #4285f4;
  padding: 28px 24px;
  color: white;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.15);
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const WizardTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

// Step indicator components
export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  flex-wrap: wrap;
  position: relative;
  
  @media (max-width: 768px) {
    margin-top: 16px;
    padding: 0 8px;
  }
`;

export const StepItem = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
`;

export const StepNumber = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : props.completed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.active ? '#4285f4' : props.completed ? '#4285f4' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  box-shadow: ${props => props.active ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none'};
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${props => props.completed && `
    &:after {
      content: '✓';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  `}
  
  ${props => props.active && `
    transform: scale(1.2);
  `}
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
    
    ${props => props.completed && `
      &:after {
        font-size: 16px;
      }
    `}
  }
`;

export const StepLabel = styled.div`
  margin-left: 10px;
  font-size: 15px;
  opacity: ${props => props.active || props.completed ? 1 : 0.7};
  font-weight: ${props => props.active ? 600 : props.completed ? 500 : 'normal'};
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-left: 8px;
  }
  
  @media (max-width: 480px) {
    max-width: 90px;
    white-space: normal;
    line-height: 1.2;
  }
`;

export const StepConnector = styled.div`
  height: 1px;
  width: 40px;
  background-color: ${props => props.completed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  margin: 0 12px;
  position: relative;
  z-index: 1;
  transition: background-color 0.3s ease;
  
  @media (max-width: 768px) {
    width: 30px;
    margin: 0 6px;
  }
  
  @media (max-width: 480px) {
    width: 20px;
    margin: 0 4px;
  }
`;

// Content area of the wizard
export const WizardContent = styled.div`
  min-height: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    min-height: 450px;
  }
  
  @media (max-width: 480px) {
    min-height: 400px;
  }
`;

// Common step styles
export const StepContainer = styled.div`
  padding: 32px 28px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export const Title = styled.h2`
  margin-bottom: 24px;
  color: #333;
  text-align: center;
  font-weight: 500;
  position: relative;
  padding-bottom: 12px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background-color: #4285f4;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
    font-size: 20px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 0 12px;
  
  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 0;
  }
  
  @media (max-width: 480px) {
    flex-direction: ${props => props.singleColumn ? 'column-reverse' : 'row'};
    gap: ${props => props.singleColumn ? '16px' : '0'};
  }
`;

export const Button = styled.button`
  background-color: ${props => props.primary ? '#4285f4' : props.danger ? '#f44336' : '#f5f5f5'};
  color: ${props => (props.primary || props.danger) ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${props => props.primary ? '#3367d6' : props.danger ? '#d32f2f' : '#e0e0e0'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 15px;
    min-width: 100px;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.fullWidthMobile ? '100%' : 'auto'};
  }
`;

// Review step specific components
export const ReviewSection = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    border-color: #d5d5d5;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #d5d5d5;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    margin-bottom: 24px;
  }
`;

export const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  font-weight: 500;
  font-size: 18px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 60px;
    height: 3px;
    background-color: #4285f4;
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 16px;
  }
`;

export const ReviewItem = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: baseline;
  
  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 4px;
  }
`;

export const ItemLabel = styled.div`
  font-weight: 500;
  width: 200px;
  color: #555;
  padding-right: 16px;
  
  @media (max-width: 768px) {
    width: 180px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding-right: 0;
  }
`;

export const ItemValue = styled.div`
  flex: 1;
  color: #333;
  font-weight: 400;
  word-break: break-word;
  position: relative;
  transition: background-color 0.2s ease;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: -6px;
  
  &:hover {
    background-color: rgba(66, 133, 244, 0.05);
  }
  
  /* Highlight empty values */
  ${props => props.isEmpty && `
    color: #999;
    font-style: italic;
  `}
  
  /* Highlight changed values */
  ${props => props.hasChanged && `
    position: relative;
    
    &:after {
      content: '${props => props.isNew ? 'New' : 'Updated'}';
      font-size: 11px;
      background-color: ${props => props.isNew ? '#4caf50' : '#2196f3'};
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 8px;
      font-weight: bold;
      display: inline-block;
      vertical-align: middle;
    }
  `}
  
  @media (max-width: 480px) {
    padding-left: 14px;
    position: relative;
    
    &:before {
      content: '→';
      position: absolute;
      left: 0;
      color: #4285f4;
      font-size: 12px;
    }
  }
`;

export const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  animation: fadeIn 0.5s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '✓';
    margin-right: 12px;
    font-size: 18px;
  }
  
  @keyframes fadeIn {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: 15px;
  }
`;

export const ErrorContainer = styled.div`
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
  color: #c62828;
  animation: shakeError 0.5s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  @keyframes shakeError {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ErrorTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  font-size: 16px;
  
  &:before {
    content: '❗';
    margin-right: 8px;
    font-size: 16px;
    color: #c62828;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const ErrorList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style-type: circle;
  
  @media (max-width: 768px) {
    padding-left: 16px;
  }
`;

export const ErrorItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.4;
  padding-left: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  a {
    color: #c62828;
    text-decoration: underline;
    
    &:hover {
      color: #b71c1c;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// Source selection specific components
export const SourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
  animation: fadeInGrid 0.5s ease-in-out;
  
  @keyframes fadeInGrid {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SourceCard = styled.div`
  border: 2px solid ${props => props.selected ? '#4285f4' : '#e0e0e0'};
  border-radius: 10px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? 'rgba(66, 133, 244, 0.08)' : 'white'};
  box-shadow: ${props => props.selected ? '0 6px 12px rgba(66, 133, 244, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.04)'};
  transform: ${props => props.selected ? 'translateY(-3px)' : 'none'};
  position: relative;
  
  &:before {
    content: ${props => props.selected ? '\'✓\'' : '\'\''};
    position: ${props => props.selected ? 'absolute' : 'static'};
    top: -12px;
    right: -12px;
    background-color: ${props => props.selected ? '#4285f4' : 'transparent'};
    color: white;
    width: ${props => props.selected ? '26px' : '0'};
    height: ${props => props.selected ? '26px' : '0'};
    border-radius: 50%;
    display: ${props => props.selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: ${props => props.selected ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'};
  }
  
  &:hover {
    border-color: ${props => props.selected ? '#4285f4' : '#4285f4'};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;

export const SourceName = styled.h3`
  margin-top: 0;
  margin-bottom: 12px;
  color: ${props => props.selected ? '#4285f4' : '#333'};
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  display: inline-block;
  
  ${SourceCard}:hover & {
    color: #4285f4;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SourceDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  transition: color 0.3s ease;
  
  ${SourceCard}:hover & {
    color: #444;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;
