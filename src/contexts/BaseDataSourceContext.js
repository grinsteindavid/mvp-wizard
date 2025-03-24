import produce from 'immer';
import React, { createContext, useContext, useReducer } from 'react';
import { set } from 'lodash';
import { validateField } from '../services/validationService';
import { transformFieldsForValidation } from '../components/Wizard/utils/formatHelpers';

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
        
        // We'll validate the entire form state instead of individual fields
        
        // Helper function to validate and update errors
        const validateAndUpdateErrors = () => {
          if (action.validationSchema) {
            // Use transformFieldsForValidation to build the complete form data object
            // This handles nested fields, array fields, and type conversions
            const formData = transformFieldsForValidation(draft.fields);
            
            // Make sure to include the field we're currently updating
            // in case it hasn't been set in the form state yet
            const parts = action.field.split('.');
            if (parts.length > 1) {
              // For nested fields like 'bidding.amount'
              const [parent, child] = [parts[0], parts[1]];
              if (!formData[parent]) formData[parent] = {};
              formData[parent][child] = action.value;
            } else {
              // For top-level fields
              formData[action.field] = action.value;
            }
            
            // Validate the entire form data against the schema
            try {
              const { error } = action.validationSchema.validate(formData, { abortEarly: false });
              
              // Clear all previous errors first
              draft.errors = {};
              
              // If there are validation errors, format and set them
              if (error) {
                // Format each error into a field-specific message
                error.details.forEach(detail => {
                  const path = detail.path.join('.');
                  draft.errors[path] = detail.message;
                });
                
                draft.isValid = false;
              } else {
                draft.isValid = true;
              }
            } catch (err) {
              console.error('Validation error:', err);
              // If validation fails catastrophically, set a general error
              draft.errors = { ...draft.errors, _general: 'Validation error occurred' };
              draft.isValid = false;
            }
          } else {
            // If no schema provided, just clear the error for this field
            if (draft.errors && draft.errors[action.field]) {
              delete draft.errors[action.field];
            }
          }
        };
        
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
          
          // Update the field value
          set(draft, nestedPath, action.value);
          
          // Validate with context
          validateAndUpdateErrors();
        } else {
          // For top-level fields, use the simple path
          set(draft, `fields.${action.field}.value`, action.value);
          
          // Validate with context
          validateAndUpdateErrors();
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
  updateField: (field, value, validationSchema) => {
    dispatch({ type: baseReducerActions.UPDATE_FIELD_VALUE, field, value, validationSchema });
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

// Helper function to validate a single field
export const validateSingleField = (validationSchema, field, value) => {
  if (!validationSchema) return { isValid: true };
  return validateField(validationSchema, field, value);
};

// Base provider component that can be extended
// Instead of creating the entire provider, this now returns the building blocks
// that each context can use to create its own provider with custom useEffects
export const createDataSourceBuilders = (initialState, reducer, validationSchema) => {
  const combinedInitialState = createCombinedInitialState(initialState);
  const combinedReducer = createCombinedReducer(reducer);
  
  return {
    combinedInitialState,
    combinedReducer,
    createContextValue: (state, dispatch) => {
      const baseActions = createBaseActions(dispatch);
      
      // Enhanced updateField that includes validation
      const enhancedUpdateField = (field, value, schemaCreator) => {
        // If we have a schema creator function, call it to get the actual schema
        const schema = typeof schemaCreator === 'function' ? schemaCreator() : schemaCreator;
        baseActions.updateField(field, value, schema);
      };
      
      return {
        state,
        ...baseActions,
        updateField: enhancedUpdateField,
        dispatch,
        validateField: (field, value) => {
          const schema = typeof validationSchema === 'function' ? validationSchema() : validationSchema;
          return validateSingleField(schema, field, value);
        }
      };
    }
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
export const createDataSourceProvider = (Context, initialState, reducer, validationSchema) => {
  const builders = createDataSourceBuilders(initialState, reducer, validationSchema);
  
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
