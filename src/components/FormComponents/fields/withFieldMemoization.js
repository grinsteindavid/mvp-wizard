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
  
  // Create a wrapper component that handles loading state
  const FieldWithLoading = (props) => {
    const { loading, ...restProps } = props;
    
    // Pass loading state as disabled if true
    return <FieldComponent 
      {...restProps} 
      disabled={props.disabled || loading}
      loading={loading} // Pass loading as a separate prop for components that want to show loading indicators
    />;
  };
  
  // Apply memoization with a custom comparison function using deep equality
  const MemoizedComponent = memo(FieldWithLoading, createDeepEqualityCheck((prevProps, nextProps, isEqual) => {
    // Check primitive props with === for performance
    const primitiveChanges = {};
    
    if (prevProps.disabled !== nextProps.disabled) primitiveChanges.disabled = { prev: prevProps.disabled, next: nextProps.disabled };
    if (prevProps.loading !== nextProps.loading) primitiveChanges.loading = { prev: prevProps.loading, next: nextProps.loading };
    if (prevProps.field.name !== nextProps.field.name) primitiveChanges['field.name'] = { prev: prevProps.field.name, next: nextProps.field.name };
    if (prevProps.field.type !== nextProps.field.type) primitiveChanges['field.type'] = { prev: prevProps.field.type, next: nextProps.field.type };
    
    // INTENTIONALLY NOT comparing onBlur and onChange function references
    // Function references change on every render but their implementation is stable
    // so we don't need to re-render when only these references change

    
    if (Object.keys(primitiveChanges).length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Memo] ${displayName} re-rendering due to primitive changes:`, primitiveChanges);
      }
      return false;
    }
    
    // Use deep equality for potentially complex objects
    const valueEqual = isEqual(prevProps.value, nextProps.value);
    const errorEqual = isEqual(prevProps.error, nextProps.error);
    const optionsEqual = isEqual(prevProps.field.options, nextProps.field.options);
    
    const shouldMemoize = valueEqual && errorEqual && optionsEqual;
    
    if (process.env.NODE_ENV === 'development' && !shouldMemoize) {
      const complexChanges = {};
      if (!valueEqual) complexChanges.value = { prev: prevProps.value, next: nextProps.value };
      if (!errorEqual) complexChanges.error = { prev: prevProps.error, next: nextProps.error };
      if (!optionsEqual) complexChanges['field.options'] = { prev: prevProps.field.options, next: nextProps.field.options };
      
      console.log(`[Memo] ${displayName} re-rendering due to complex changes:`, complexChanges);
    }
    
    return shouldMemoize;
  }));
  
  // Set a display name for the memoized component
  MemoizedComponent.displayName = `withFieldMemoization(${displayName})`;
  
  return MemoizedComponent;
};

export default withFieldMemoization;
