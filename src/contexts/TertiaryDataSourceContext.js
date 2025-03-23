import { createContext, useReducer, useEffect } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import tertiaryDataService from '../services/http/tertiaryDataService';

// Create the context
const TertiaryDataSourceContext = createContext();

// Initial state specific to Tertiary Data Source - aligned with tertiarySchema
const initialState = {
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      value: ''
    },
    projectObjective: {
      label: 'Project Objective',
      type: 'select',
      required: true,
      value: '',
      loading: false, // Initialize loading state
      options: []
    },
    startDate: {
      label: 'Start Date',
      type: 'date',
      required: true,
      value: ''
    },
    endDate: {
      label: 'End Date',
      type: 'date',
      required: false,
      value: ''
    },
    budget: {
      label: 'Budget',
      type: 'group',
      fields: {
        amount: {
          label: 'Amount',
          type: 'number',
          required: true,
          value: ''
        },
        type: {
          label: 'Budget Type',
          type: 'select',
          required: true,
          value: '',
          options: [
            { value: 'daily', label: 'Daily Budget' },
            { value: 'lifetime', label: 'Lifetime Budget' }
          ]
        }
      }
    },
    bidding: {
      label: 'Bidding',
      type: 'group',
      fields: {
        strategy: {
          label: 'Bidding Strategy',
          type: 'select',
          options: [],
          required: true,
          value: '',
          loading: false // Initialize loading state
        },
        amount: {
          label: 'Bid Amount',
          type: 'number',
          required: false,
          value: '',
          dependsOn: { field: 'strategy', value: 'manual' }
        }
      }
    }
  }
};

// Tertiary-specific reducer actions
const tertiaryActions = {
};

// Tertiary-specific reducer
const tertiaryReducer = (state, action) => {
  switch (action.type) {
    default:
      // Return the state unchanged to let the base reducer handle it
      return state;
  }
};

// Get the building blocks from the base context
const builders = createDataSourceBuilders(initialState, tertiaryReducer);

// Create the provider component with custom side effects
export const TertiaryDataSourceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(builders.combinedReducer, builders.combinedInitialState);
  const baseContextValue = builders.createContextValue(state, dispatch);
  const { setFieldLoading, updateFieldOptions } = baseContextValue;

  
  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state for fields
        setFieldLoading('projectObjective', true);
        setFieldLoading('bidding.strategy', true);
        
        // Load objectives and bidding strategies in parallel
        const [
          {data: objectives},
          {data: strategies}
        ] = await Promise.all([
          tertiaryDataService.getObjectives(),
          tertiaryDataService.getBiddingStrategies()
        ]);
        
        updateFieldOptions('projectObjective', objectives);
        updateFieldOptions('bidding.strategy', strategies);
        
        // Clear loading states
        setFieldLoading('projectObjective', false);
        setFieldLoading('bidding.strategy', false);
      } catch (error) {
        console.error('Error loading data from services:', error);
        // Clear loading states on error
        setFieldLoading('projectObjective', false);
        setFieldLoading('bidding.strategy', false);
      }
    };

    loadData();
    // These functions are stable references from the context value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  // Create the context value with base actions and tertiary-specific actions
  const contextValue = {
    ...baseContextValue,
  };
  
  return (
    <TertiaryDataSourceContext.Provider value={contextValue}>
      {children}
    </TertiaryDataSourceContext.Provider>
  );
};

// Create the custom hook
export const useTertiaryDataSource = createUseDataSource(TertiaryDataSourceContext, 'Tertiary');

// Export actions for use in components
export const tertiaryDataSourceActions = {
  ...baseActions,
  ...tertiaryActions
};
