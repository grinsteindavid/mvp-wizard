import produce from 'immer';
import React, { createContext, useContext, useReducer } from 'react';
import { set } from 'lodash';

// Base initial state for all data sources
const baseInitialState = {
  isValid: false,
  errors: {},
  isSubmitting: false,
  isSubmitted: false
  // loadingFields removed - now tracked in each field definition
};

// Base reducer actions that all data sources will have
const baseReducerActions = {
  UPDATE_FIELD_VALUE: 'UPDATE_FIELD_VALUE', // Updated action for field value in field definition
  SET_VALIDATION_RESULT: 'SET_VALIDATION_RESULT',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_SUBMITTED: 'SET_SUBMITTED',
  RESET_FORM: 'RESET_FORM',
  SET_FIELD_LOADING: 'SET_FIELD_LOADING', // Action for field loading state (now updates loading in field definition)
  UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS' // Action for updating field options dynamically
};

// Base reducer function that all data sources can extend
const baseReducer = (state, action) => {
  switch (action.type) {
    case baseReducerActions.UPDATE_FIELD_VALUE:
      return produce(state, draft => {
        // Handle nested fields like 'targeting.countries'
        const parts = action.field.split('.');
        
        if (parts.length > 1) {
          // For nested fields, construct the path to the value property
          // Format: fields.groupName.fields.fieldName.value
          const nestedPath = parts.reduce((path, part, index) => {
            if (index === 0) {
              // First part is the top-level field name
              return `fields.${part}`;
            } else if (index < parts.length - 1) {
              // Middle parts need to include 'fields.' prefix
              return `${path}.fields.${part}`;
            } else {
              // Last part is the actual field name
              return `${path}.fields.${part}.value`;
            }
          }, '');
          
          set(draft, nestedPath, action.value);
          
          // Clear the corresponding error when field is updated
          if (draft.errors && draft.errors[action.field]) {
            delete draft.errors[action.field];
          }
        } else {
          // For top-level fields, use the simple path
          set(draft, `fields.${action.field}.value`, action.value);
          
          // Clear the corresponding error when field is updated
          if (draft.errors && draft.errors[action.field]) {
            delete draft.errors[action.field];
          }
        }
      });
    case baseReducerActions.SET_VALIDATION_RESULT:
      return produce(state, draft => {
        draft.isValid = action.payload.isValid;
        draft.errors = action.payload.errors || {};
      });
    case baseReducerActions.SET_SUBMITTING:
      return produce(state, draft => {
        draft.isSubmitting = action.payload;
      });
    case baseReducerActions.SET_SUBMITTED:
      return produce(state, draft => {
        draft.isSubmitted = action.payload;
      });
    case baseReducerActions.SET_FIELD_LOADING:
      return produce(state, draft => {
        // Handle nested fields like 'targeting.countries'
        const parts = action.field.split('.');
        
        if (parts.length > 1) {
          // For nested fields, construct the path to the loading property
          // Format: fields.groupName.fields.fieldName.loading
          const nestedPath = parts.reduce((path, part, index) => {
            if (index === 0) {
              // First part is the top-level field name
              return `fields.${part}`;
            } else if (index < parts.length - 1) {
              // Middle parts need to include 'fields.' prefix
              return `${path}.fields.${part}`;
            } else {
              // Last part is the actual field name
              return `${path}.fields.${part}.loading`;
            }
          }, '');
          
          set(draft, nestedPath, action.isLoading);
        } else {
          // For top-level fields, use the simple path
          set(draft, `fields.${action.field}.loading`, action.isLoading);
        }
      });
    case baseReducerActions.UPDATE_FIELD_OPTIONS:
      return produce(state, draft => {
        // Handle nested fields like 'targeting.countries'
        const parts = action.fieldName.split('.');
        
        if (parts.length > 1) {
          // For nested fields, construct the path correctly
          // Format: fields.groupName.fields.fieldName.options
          const nestedPath = parts.reduce((path, part, index) => {
            if (index === 0) {
              // First part is the top-level field name
              return `fields.${part}`;
            } else if (index < parts.length - 1) {
              // Middle parts need to include 'fields.' prefix
              return `${path}.fields.${part}`;
            } else {
              // Last part is the actual field name
              return `${path}.fields.${part}.options`;
            }
          }, '');
          
          set(draft, nestedPath, action.options);
        } else {
          // For top-level fields, use the simple path
          set(draft, `fields.${action.fieldName}.options`, action.options);
        }
      });
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
    dispatch({ type: baseReducerActions.UPDATE_FIELD_VALUE, field, value });
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
