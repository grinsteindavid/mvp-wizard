import React, { createContext, useReducer, useEffect } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import { primaryDataService } from '../services/http';

// Create the context
const PrimaryDataSourceContext = createContext();

// Initial state specific to Primary Integration - aligned with primarySchema
const initialState = {
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      value: '',
      description: 'A unique name to identify your advertising project'
    },
    dailyBudget: {
      label: 'Daily Budget',
      type: 'number',
      required: true,
      value: '',
      description: 'Maximum amount to spend per day on this advertising campaign'
    },
    bidStrategy: {
      label: 'Bid Strategy',
      type: 'select',
      required: true,
      value: '',
      loading: false, // Initialize loading state
      options: [], // Will be populated via dispatch when strategies are loaded
      description: 'Strategy that determines how bids are set for your ads'
    },
    keywords: {
      label: 'Keywords',
      type: 'textarea',
      required: true,
      value: '',
      placeholder: 'Enter keywords separated by commas',
      description: 'Words or phrases that match your ads with user searches'
    },
    categoryGroups: {
      label: 'Category Groups',
      type: 'array',
      required: true,
      value: [],
      loading: false, // Initialize loading state
      description: 'Groups of related product categories for targeting',
      fields: {
        name: {
          label: 'Group Name',
          type: 'text',
          required: true,
          description: 'Name for this category group'
        },
        cpc: {
          label: 'Max CPC',
          type: 'number',
          required: true,
          description: 'Maximum cost-per-click bid for this category group'
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
    // These functions are stable references from the context value
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
