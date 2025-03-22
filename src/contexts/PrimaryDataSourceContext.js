import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import { primaryDataService } from '../services/http';
import { validateField } from '../services/validationService';

// Create the context
const PrimaryDataSourceContext = createContext();

// Initial state specific to Primary Integration - aligned with primarySchema
const initialState = {
  projectName: '',
  dailyBudget: '',
  bidStrategy: '',
  keywords: '',
  categoryGroups: [],
  // Available options for selection - not part of schema validation
  availableBidStrategies: [],
  // Store field definitions with their options in state
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      validateField: (value, formData) => validateField('primary', 'projectName', value, formData)
    },
    dailyBudget: {
      label: 'Daily Budget',
      type: 'number',
      required: true,
      validateField: (value, formData) => validateField('primary', 'dailyBudget', value, formData)
    },
    bidStrategy: {
      label: 'Bid Strategy',
      type: 'select',
      required: true,
      options: [], // Will be populated via dispatch when strategies are loaded
      validateField: (value, formData) => validateField('primary', 'bidStrategy', value, formData)
    },
    keywords: {
      label: 'Keywords',
      type: 'textarea',
      required: true,
      placeholder: 'Enter keywords separated by commas',
      validateField: (value, formData) => validateField('primary', 'keywords', value, formData)
    },
    categoryGroups: {
      label: 'Category Groups',
      type: 'array',
      required: true,
      validateField: (value, formData) => validateField('primary', 'categoryGroups', value, formData),
      fields: {
        name: {
          label: 'Group Name',
          type: 'text',
          required: true,
          validateField: (value, formData, index) => validateField('primary', `categoryGroups.${index}.name`, value, formData)
        },
        cpc: {
          label: 'Max CPC',
          type: 'number',
          required: true,
          validateField: (value, formData, index) => validateField('primary', `categoryGroups.${index}.cpc`, value, formData)
        }
      }
    }
  }
};

// Primary-specific reducer actions
const primaryActions = {
  ADD_CATEGORY_GROUP: 'ADD_CATEGORY_GROUP',
  REMOVE_CATEGORY_GROUP: 'REMOVE_CATEGORY_GROUP',
  UPDATE_CATEGORY_GROUP: 'UPDATE_CATEGORY_GROUP',
  SET_BID_STRATEGIES: 'SET_BID_STRATEGIES',
  UPDATE_FIELD_OPTIONS: 'UPDATE_FIELD_OPTIONS'
};

// Primary-specific reducer
const primaryReducer = (state, action) => {
  switch (action.type) {
    case primaryActions.ADD_CATEGORY_GROUP:
      return {
        ...state,
        categoryGroups: [...state.categoryGroups, { name: '', cpc: '' }]
      };
    case primaryActions.REMOVE_CATEGORY_GROUP:
      return {
        ...state,
        categoryGroups: state.categoryGroups.filter((_, index) => index !== action.index)
      };
    case primaryActions.UPDATE_CATEGORY_GROUP:
      const updatedCategoryGroups = [...state.categoryGroups];
      updatedCategoryGroups[action.index] = {
        ...updatedCategoryGroups[action.index],
        [action.field]: action.value
      };
      return {
        ...state,
        categoryGroups: updatedCategoryGroups
      };

    case primaryActions.SET_BID_STRATEGIES:
      return {
        ...state,
        availableBidStrategies: action.payload
      };
      
    default:
      // Return the state unchanged to let the base reducer handle it
      return state;
  }
};


// Get the building blocks from the base context
const builders = createDataSourceBuilders(initialState, primaryReducer);

// Create the provider component with custom side effects
export const PrimaryDataSourceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(builders.combinedReducer, builders.combinedInitialState);
  const baseContextValue = builders.createContextValue(state, dispatch);
  
  // Primary-specific actions - wrapped in useCallback to prevent unnecessary re-renders
  const addCategoryGroup = useCallback(() => {
    dispatch({ type: primaryActions.ADD_CATEGORY_GROUP });
  }, [dispatch]);
  
  const removeCategoryGroup = useCallback((index) => {
    dispatch({ type: primaryActions.REMOVE_CATEGORY_GROUP, index });
  }, [dispatch]);
  
  const updateCategoryGroup = useCallback((index, field, value) => {
    dispatch({ type: primaryActions.UPDATE_CATEGORY_GROUP, index, field, value });
  }, [dispatch]);
  

  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state for bidStrategy field
        baseContextValue.setFieldLoading('bidStrategy', true);
        
        // Load bid strategies
        const {data: strategies} = await primaryDataService.getOptimizationStrategies();
        // Dispatch action to set bid strategies
        dispatch({ type: primaryActions.SET_BID_STRATEGIES, payload: strategies});
        baseContextValue.updateFieldOptions('bidStrategy', strategies);
        
        // Clear loading state for bidStrategy field
        baseContextValue.setFieldLoading('bidStrategy', false);
      } catch (error) {
        console.error('Error loading data from services:', error);
        // Clear loading state on error too
        baseContextValue.setFieldLoading('bidStrategy', false);
      }
    };
    
    loadData();
  }, []);
  
  // Create the context value with base actions and primary-specific actions
  const contextValue = {
    ...baseContextValue,
    addCategoryGroup,
    removeCategoryGroup,
    updateCategoryGroup,
    // Use fields from the state if available, otherwise use the builders fields
    fields: state.fields || builders.fields
  };
  
  return (
    <PrimaryDataSourceContext.Provider value={contextValue}>
      {children}
    </PrimaryDataSourceContext.Provider>
  );
};

// Create the custom hook
export const usePrimaryDataSource = createUseDataSource(PrimaryDataSourceContext, 'Primary');

// Export actions for use in components
export const primaryDataSourceActions = {
  ...baseActions,
  ...primaryActions
};
