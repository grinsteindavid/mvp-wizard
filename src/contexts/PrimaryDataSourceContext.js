import React, { createContext, useReducer, useEffect } from 'react';
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
 
};

// Primary-specific reducer
const primaryReducer = (state, action) => {
  switch (action.type) {
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
  const { setFieldLoading, updateFieldOptions } = baseContextValue;

  

  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state for bidStrategy field
        setFieldLoading('bidStrategy', true);
        
        // Load bid strategies
        const {data: strategies} = await primaryDataService.getOptimizationStrategies();
        // Dispatch action to set bid strategies
        updateFieldOptions('bidStrategy', strategies);
        
        // Clear loading state for bidStrategy field
        setFieldLoading('bidStrategy', false);
      } catch (error) {
        console.error('Error loading data from services:', error);
        // Clear loading state on error too
        setFieldLoading('bidStrategy', false);
      }
    };
    
    loadData();
  }, []);
  
  // Create the context value with base actions and primary-specific actions
  const contextValue = {
    ...baseContextValue,
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
