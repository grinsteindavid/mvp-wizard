import { createContext, useReducer, useEffect } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import secondaryDataService from '../services/http/secondaryDataService';

// Create the context
const SecondaryDataSourceContext = createContext();

// Initial state specific to Secondary Data Source - aligned with secondarySchema
const initialState = {
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      value: ''
    },
    targetUrl: {
      label: 'Target URL',
      type: 'url',
      required: true,
      value: ''
    },
    bidAmount: {
      label: 'Bid Amount',
      type: 'number',
      required: true,
      value: ''
    },
    dailyBudget: {
      label: 'Daily Budget',
      type: 'number',
      required: true,
      value: ''
    },
    targeting: {
      label: 'Targeting',
      type: 'group',
      fields: {
        countries: {
          label: 'Countries',
          type: 'multiselect',
          options: [],
          required: true,
          value: [],
          loading: false // Initialize loading state
        },
        devices: {
          label: 'Devices',
          type: 'checkboxes',
          options: [],
          required: true,
          value: [],
          loading: false // Initialize loading state
        }
      }
    }
  }
};

// Secondary-specific reducer actions
const secondaryActions = {

};

// Secondary-specific reducer
const secondaryReducer = (state, action) => {
  switch (action.type) {

    default:
      // Return the state unchanged to let the base reducer handle it
      return state;
  }
};


// Get the building blocks from the base context
const builders = createDataSourceBuilders(initialState, secondaryReducer);

// Create the provider component with custom side effects
export const SecondaryDataSourceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(builders.combinedReducer, builders.combinedInitialState);
  const baseContextValue = builders.createContextValue(state, dispatch);
  const { setFieldLoading, updateFieldOptions } = baseContextValue;
  
  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state
        setFieldLoading('targeting.countries', true);
        setFieldLoading('targeting.devices', true);
        
        // Load all targeting data in parallel
        const [
          { data: countries },
          { data: devices }
        ] = await Promise.all([
          secondaryDataService.getCountries(),
          secondaryDataService.getDevices()
        ]);

        updateFieldOptions('targeting.countries', countries);
        setFieldLoading('targeting.countries', false);
        
        updateFieldOptions('targeting.devices', devices);
        setFieldLoading('targeting.devices', false);
      } catch (error) {
        console.error('Error loading data from services:', error);
        // Clear loading states on error
        setFieldLoading('targeting.countries', false);
        setFieldLoading('targeting.devices', false);
      }
    };
    
    loadData();
    // eslint-disable-next-line
  }, []);
  
  // Create the context value with base actions and secondary-specific actions
  const contextValue = {
    ...baseContextValue,
  };
  
  return (
    <SecondaryDataSourceContext.Provider value={contextValue}>
      {children}
    </SecondaryDataSourceContext.Provider>
  );
};

// Create the custom hook
export const useSecondaryDataSource = createUseDataSource(SecondaryDataSourceContext, 'Secondary');

// Export actions for use in components
export const secondaryDataSourceActions = {
  ...baseActions,
  ...secondaryActions
};
