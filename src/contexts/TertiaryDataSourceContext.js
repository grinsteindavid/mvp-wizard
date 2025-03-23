import { createContext, useReducer, useEffect } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import tertiaryDataService from '../services/http/tertiaryDataService';
import { validateField } from '../services/validationService';

// Create the context
const TertiaryDataSourceContext = createContext();

// Initial state specific to Tertiary Data Source - aligned with tertiarySchema
const initialState = {
  projectName: '',
  projectObjective: '',
  startDate: '',
  endDate: '',
  budget: {
    amount: '',
    type: ''
  },
  bidding: {
    strategy: '',
    amount: ''
  },
  // Available options for selection - not part of schema validation
  availableObjectives: [],
  availableBiddingStrategies: [],
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      validateField: (value, formData) => validateField('tertiary', 'projectName', value, formData)
    },
    projectObjective: {
      label: 'Project Objective',
      type: 'select',
      required: true,
      options: [],
      validateField: (value, formData) => validateField('tertiary', 'projectObjective', value, formData)
    },
    startDate: {
      label: 'Start Date',
      type: 'date',
      required: true,
      validateField: (value, formData) => validateField('tertiary', 'startDate', value, formData)
    },
    endDate: {
      label: 'End Date',
      type: 'date',
      required: false,
      validateField: (value, formData) => validateField('tertiary', 'endDate', value, formData)
    },
    budget: {
      label: 'Budget',
      type: 'group',
      validateField: (value, formData) => validateField('tertiary', 'budget', value, formData),
      fields: {
        amount: {
          label: 'Amount',
          type: 'number',
          required: true,
          validateField: (value, formData) => validateField('tertiary', 'budget.amount', value, formData)
        },
        type: {
          label: 'Budget Type',
          type: 'select',
          required: true,
          options: [
            { value: 'daily', label: 'Daily Budget' },
            { value: 'lifetime', label: 'Lifetime Budget' }
          ],
          validateField: (value, formData) => validateField('tertiary', 'budget.type', value, formData)
        }
      }
    },
    bidding: {
      label: 'Bidding',
      type: 'group',
      validateField: (value, formData) => validateField('tertiary', 'bidding', value, formData),
      fields: {
        strategy: {
          label: 'Bidding Strategy',
          type: 'select',
          options: [],
          required: true,
          validateField: (value, formData) => validateField('tertiary', 'bidding.strategy', value, formData)
        },
        amount: {
          label: 'Bid Amount',
          type: 'number',
          required: false,
          dependsOn: { field: 'strategy', value: 'manual' },
          validateField: (value, formData) => validateField('tertiary', 'bidding.amount', value, formData)
        }
      }
    }
  }
};

// Tertiary-specific reducer actions
const tertiaryActions = {
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  UPDATE_BIDDING: 'UPDATE_BIDDING',

  SET_OBJECTIVES: 'SET_OBJECTIVES',
  SET_BUDGET_TYPES: 'SET_BUDGET_TYPES',
  SET_BIDDING_STRATEGIES: 'SET_BIDDING_STRATEGIES'
};

// Tertiary-specific reducer
const tertiaryReducer = (state, action) => {
  switch (action.type) {
    case tertiaryActions.UPDATE_BUDGET:
      return {
        ...state,
        budget: {
          ...state.budget,
          [action.field]: action.value
        }
      };
    case tertiaryActions.UPDATE_BIDDING:
      return {
        ...state,
        bidding: {
          ...state.bidding,
          [action.field]: action.value
        }
      };

    case tertiaryActions.SET_OBJECTIVES:
      return {
        ...state,
        availableObjectives: action.payload
      };
    case tertiaryActions.SET_BUDGET_TYPES:
      return {
        ...state,
        availableBudgetTypes: action.payload
      };
    case tertiaryActions.SET_BIDDING_STRATEGIES:
      return {
        ...state,
        availableBiddingStrategies: action.payload
      };
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
  
  // Tertiary-specific actions
  const updateBudget = (field, value) => {
    dispatch({ type: tertiaryActions.UPDATE_BUDGET, field, value });
  };
  
  const updateBidding = (field, value) => {
    dispatch({ type: tertiaryActions.UPDATE_BIDDING, field, value });
  };
  
  const setObjectives = (objectives) => {
    dispatch({ type: tertiaryActions.SET_OBJECTIVES, payload: objectives });
  };
  
  const setBudgetTypes = (types) => {
    dispatch({ type: tertiaryActions.SET_BUDGET_TYPES, payload: types });
  };
  
  const setBiddingStrategies = (strategies) => {
    dispatch({ type: tertiaryActions.SET_BIDDING_STRATEGIES, payload: strategies });
  };
  
  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state for fields
        setFieldLoading('projectObjective', true);
        setFieldLoading('bidding.strategy', true);
        
        // Load objectives
        const {data: objectives} = await tertiaryDataService.getObjectives();
        setObjectives(objectives);
        updateFieldOptions('projectObjective', objectives);
        
        // Load bidding strategies
        const {data: strategies} = await tertiaryDataService.getBiddingStrategies();
        setBiddingStrategies(strategies);
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
  }, []);

  
  // Create the context value with base actions and tertiary-specific actions
  const contextValue = {
    ...baseContextValue,
    updateBudget,
    updateBidding,
    setObjectives,
    setBudgetTypes,
    setBiddingStrategies,
    // No need to add fields again as it's already included in baseContextValue.state
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
