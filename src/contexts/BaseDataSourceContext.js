import React, { createContext, useContext, useReducer } from 'react';
import { set } from 'lodash';

// Base initial state for all data sources
const baseInitialState = {
  projectTitle: '',
  isValid: false,
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  loadingFields: {} // Track loading state for individual fields
};

// Base reducer actions that all data sources will have
const baseReducerActions = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_SUBMITTED: 'SET_SUBMITTED',
  RESET_FORM: 'RESET_FORM',
  SET_FIELD_LOADING: 'SET_FIELD_LOADING', // New action for field loading state
  UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS' // Action for updating field options dynamically
};

// Base reducer function that all data sources can extend
const baseReducer = (state, action) => {
  switch (action.type) {
    case baseReducerActions.UPDATE_FIELD:
      return set({...state}, action.field, action.value);
    case baseReducerActions.SET_VALIDATION_RESULT:
      return {
        ...state,
        isValid: action.payload.isValid,
        errors: action.payload.errors || {}
      };
    case baseReducerActions.SET_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case baseReducerActions.SET_SUBMITTED:
      return {
        ...state,
        isSubmitted: action.payload
      };
    case baseReducerActions.SET_FIELD_LOADING:
      console.log('Setting field loading state:', action.field, action.isLoading);
      return set(
        {...state},
        'loadingFields.' + action.field,
        action.isLoading
      );
    case baseReducerActions.UPDATE_FIELD_OPTIONS:
      // For nested fields like 'bidding.strategy'
      const fieldPath = `fields.${action.fieldName}.options`;
      return set({...state}, fieldPath, action.options);
    case baseReducerActions.RESET_FORM:
      return { ...baseInitialState };
    default:
      return state;
  }
};

// Create the base context
const BaseDataSourceContext = createContext();

// Base actions creator that all data sources will have
export const createBaseActions = (dispatch) => ({
  updateField: (field, value) => {
    dispatch({ type: baseReducerActions.UPDATE_FIELD, field, value });
  },
  
  setValidationResult: (result) => {
    dispatch({ type: baseReducerActions.SET_VALIDATION_RESULT, payload: result });
  },
  
  setSubmitting: (isSubmitting) => {
    dispatch({ type: baseReducerActions.SET_SUBMITTING, payload: isSubmitting });
  },
  
  setSubmitted: (isSubmitted) => {
    dispatch({ type: baseReducerActions.SET_SUBMITTED, payload: isSubmitted });
  },
  
  setFieldLoading: (field, isLoading) => {
    dispatch({ type: baseReducerActions.SET_FIELD_LOADING, field, isLoading });
  },
  
  updateFieldOptions: (fieldName, options) => {
    dispatch({ type: baseReducerActions.UPDATE_FIELD_OPTIONS, fieldName, options });
  },
  
  resetForm: () => {
    dispatch({ type: baseReducerActions.RESET_FORM });
  }
});

// Create a combined reducer that handles both source-specific and base actions
export const createCombinedReducer = (sourceReducer) => (state, action) => {
  const newState = sourceReducer ? sourceReducer(state, action) : state;
  // If the source-specific reducer didn't handle the action (state unchanged),
  // use the base reducer
  return newState === state ? baseReducer(state, action) : newState;
};

// Create combined initial state
export const createCombinedInitialState = (sourceInitialState) => ({
  ...baseInitialState,
  ...sourceInitialState
});

// Base provider component that can be extended
// Instead of creating the entire provider, this now returns the building blocks
// that each context can use to create its own provider with custom useEffects
export const createDataSourceBuilders = (initialState, reducer) => {
  const combinedInitialState = createCombinedInitialState(initialState);
  const combinedReducer = createCombinedReducer(reducer);
  
  return {
    combinedInitialState,
    combinedReducer,
    createContextValue: (state, dispatch) => ({
      state,
      ...createBaseActions(dispatch),
      dispatch
    })
  };
};

// Create a custom hook factory for data source contexts
export const createUseDataSource = (SourceContext, sourceName) => {
  return () => {
    const context = useContext(SourceContext);
    if (!context) {
      throw new Error(`use${sourceName}DataSource must be used within a ${sourceName}DataSourceProvider`);
    }
    return context;
  };
};

// Export the base actions for reuse
export const baseActions = baseReducerActions;

// For backward compatibility with tests
export const createDataSourceProvider = (Context, initialState, reducer, fields) => {
  const builders = createDataSourceBuilders(initialState, reducer, fields);
  
  return ({ children }) => {
    const [state, dispatch] = useReducer(builders.combinedReducer, builders.combinedInitialState);
    const contextValue = builders.createContextValue(state, dispatch);
    
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    );
  };
};

// Export the base context for potential direct use
export default BaseDataSourceContext;
