import { memo } from 'react';
import { createDeepEqualityCheck } from '../../../utils/deepEqual';

/**
 * Higher-Order Component that applies memoization to field components
 * with a consistent comparison function
 * 
 * @param {React.ComponentType} FieldComponent - The field component to memoize
 * @returns {React.MemoExoticComponent} - The memoized component
 */
const withFieldMemoization = (FieldComponent) => {
  // Create a display name for the wrapped component
  const displayName = FieldComponent.displayName || FieldComponent.name || 'Component';
  
  // Apply memoization with a custom comparison function using deep equality
  const MemoizedComponent = memo(FieldComponent, createDeepEqualityCheck((prevProps, nextProps, isEqual) => {
    // Check primitive props with === for performance
    if (
      prevProps.disabled !== nextProps.disabled ||
      prevProps.field.name !== nextProps.field.name ||
      prevProps.field.type !== nextProps.field.type ||
      prevProps.onBlur !== nextProps.onBlur
    ) {
      return false;
    }
    
    // Use deep equality for potentially complex objects
    return isEqual(prevProps.value, nextProps.value) && 
           isEqual(prevProps.error, nextProps.error) &&
           isEqual(prevProps.field.options, nextProps.field.options);
  }));
  
  // Set a display name for the memoized component
  MemoizedComponent.displayName = `withFieldMemoization(${displayName})`;
  
  return MemoizedComponent;
};

export default withFieldMemoization;
