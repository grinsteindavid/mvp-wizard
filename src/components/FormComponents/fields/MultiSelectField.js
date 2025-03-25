import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FieldContainer, Label, ErrorMessage, HelpText } from '../styled/FormElements';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
`;

const ControlButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  
  &:hover {
    background-color: #e9e9e9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
`;

const SelectedCount = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const OptionsContainer = styled.div`
  border: 1px solid ${props => props.hasError ? '#e53935' : '#ccc'};
  border-radius: 4px;
  max-height: ${props => props.size * 36}px;
  min-height: ${props => Math.min(5, props.size) * 36}px;
  overflow-y: auto;
  background-color: #fff;
  position: relative;
  
  &:focus-within {
    outline: 2px solid #2684ff;
    border-color: #2684ff;
  }
  
  ${props => props.disabled && `
    background-color: #f5f5f5;
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const OptionItem = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  transition: background-color 0.1s;
  position: relative;
  
  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f5f5f5'};
  }
  
  &:focus {
    outline: none;
    background-color: #e6f0ff;
  }
  
  ${props => props.selected && `
    background-color: #e6f0ff;
    
    &:hover {
      background-color: #d9e8ff;
    }
  `}
`;

const CheckIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: ${props => props.selected ? '#1976d2' : 'transparent'};
  
  &::before {
    content: '✓';
    font-size: 14px;
    font-weight: bold;
  }
`;

const OptionLabel = styled.span`
  flex: 1;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  z-index: 2;
`;

const EmptyMessage = styled.div`
  padding: 10px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const MultiSelectField = React.memo(({ 
  field, 
  value, 
  onChange, 
  error, 
  disabled = false,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const optionsRef = useRef({});
  
  // Handle initial empty value
  const currentValue = useMemo(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);
  
  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!field.options || !Array.isArray(field.options)) return [];
    if (!searchTerm.trim()) return field.options;
    
    return field.options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [field.options, searchTerm]);
  
  // Toggle selection of an option
  const toggleOption = useCallback((optionValue) => {
    if (disabled || loading) return;
    
    let newValues;
    if (currentValue.includes(optionValue)) {
      newValues = currentValue.filter(val => val !== optionValue);
    } else {
      newValues = [...currentValue, optionValue];
    }
    
    onChange(field.name, newValues);
  }, [currentValue, disabled, field.name, loading, onChange]);
  
  // Select all options
  const handleSelectAll = useCallback(() => {
    if (!field.options || disabled || loading) return;
    const allValues = field.options.map(option => option.value);
    onChange(field.name, allValues);
  }, [field.name, field.options, onChange, disabled, loading]);
  
  // Deselect all options
  const handleDeselectAll = useCallback(() => {
    if (disabled || loading) return;
    onChange(field.name, []);
  }, [field.name, onChange, disabled, loading]);
  
  // Select visible (filtered) options
  const handleSelectVisible = useCallback(() => {
    if (disabled || loading) return;
    const visibleValues = filteredOptions.map(option => option.value);
    onChange(field.name, [...new Set([...currentValue, ...visibleValues])]);
  }, [filteredOptions, currentValue, onChange, field.name, disabled, loading]);
  
  // Deselect visible (filtered) options
  const handleDeselectVisible = useCallback(() => {
    if (disabled || loading) return;
    const visibleValues = new Set(filteredOptions.map(option => option.value));
    const newValues = currentValue.filter(val => !visibleValues.has(val));
    onChange(field.name, newValues);
  }, [filteredOptions, currentValue, onChange, field.name, disabled, loading]);
  
  // Clear search when field options change
  useEffect(() => {
    setSearchTerm('');
  }, [field.options]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (disabled || loading) return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => {
          const newIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
          // Scroll to element if needed
          if (optionsRef.current[newIndex]) {
            optionsRef.current[newIndex].scrollIntoView({ block: 'nearest' });
          }
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
          // Scroll to element if needed
          if (optionsRef.current[newIndex]) {
            optionsRef.current[newIndex].scrollIntoView({ block: 'nearest' });
          }
          return newIndex;
        });
        break;
        
      case ' ':
      case 'Enter':
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          e.preventDefault();
          toggleOption(filteredOptions[focusedIndex].value);
        }
        break;
        
      case 'a':
        if (e.ctrlKey) {
          e.preventDefault();
          handleSelectVisible();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setFocusedIndex(-1);
        break;
        
      default:
        break;
    }
  }, [filteredOptions, toggleOption, focusedIndex, handleSelectVisible, disabled, loading]);
  
  // Focus management
  useEffect(() => {
    // Reset focused index when filtered options change
    setFocusedIndex(prev => prev >= filteredOptions.length ? -1 : prev);
  }, [filteredOptions]);
  
  return (
    <FieldContainer>
      {!loading && field.options && field.options.length > 5 && (
        <SearchInput
          type="text"
          placeholder="Search options..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled || loading}
          aria-label={`Search ${field.label} options`}
        />
      )}
      
      {!loading && field.options && field.options.length > 0 && (
        <ControlsContainer>
          <ControlButton 
            type="button" 
            onClick={handleSelectAll} 
            disabled={disabled || loading || !field.options.length}
            aria-label="Select all options"
          >
            Select All
          </ControlButton>
          <ControlButton 
            type="button" 
            onClick={handleDeselectAll} 
            disabled={disabled || loading || !currentValue.length}
            aria-label="Deselect all options"
          >
            Deselect All
          </ControlButton>
        </ControlsContainer>
      )}
      
      {searchTerm && filteredOptions.length > 0 && (
        <ControlsContainer>
          <ControlButton 
            type="button" 
            onClick={handleSelectVisible} 
            disabled={disabled || loading}
            aria-label={`Select ${filteredOptions.length} filtered options`}
          >
            Select Filtered
          </ControlButton>
          <ControlButton 
            type="button" 
            onClick={handleDeselectVisible} 
            disabled={disabled || loading}
            aria-label={`Deselect ${filteredOptions.length} filtered options`}
          >
            Deselect Filtered
          </ControlButton>
        </ControlsContainer>
      )}
      
      <div style={{ position: 'relative' }}>
        <OptionsContainer
          ref={containerRef}
          role="listbox"
          aria-multiselectable="true"
          tabIndex={disabled ? -1 : 0}
          hasError={!!error}
          disabled={disabled}
          size={field.size || 5}
          onKeyDown={handleKeyDown}
          data-testid={`multiselect-${field.name}`}
          aria-busy={loading}
          aria-invalid={!!error}
        >
          {field.options && filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = currentValue.includes(option.value);
              const isFocused = index === focusedIndex;
              
              return (
                <OptionItem
                  key={option.value}
                  ref={el => optionsRef.current[index] = el}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isSelected}
                  selected={isSelected}
                  disabled={disabled || loading}
                  onClick={() => toggleOption(option.value)}
                  data-value={option.value}
                  data-focused={isFocused}
                >
                  <CheckIcon selected={isSelected} aria-hidden="true" />
                  <OptionLabel>{option.label}</OptionLabel>
                </OptionItem>
              );
            })
          ) : (
            <EmptyMessage>
              {field.options && field.options.length > 0 ? 
                'No matching options' : 'No options available'}
            </EmptyMessage>
          )}
        </OptionsContainer>
        
        {loading && (
          <LoadingIndicator aria-live="polite">
            Loading options...
          </LoadingIndicator>
        )}
      </div>
      
      {currentValue.length > 0 && (
        <SelectedCount>
          {currentValue.length} of {field.options ? field.options.length : 0} selected
        </SelectedCount>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {field.helpText && <HelpText>{field.helpText}</HelpText>}
    </FieldContainer>
  );
});

MultiSelectField.displayName = 'MultiSelectField';

export default MultiSelectField;
