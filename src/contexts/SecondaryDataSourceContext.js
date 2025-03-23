import { createContext, useReducer, useEffect } from 'react';
import { createDataSourceBuilders, createUseDataSource, baseActions } from './BaseDataSourceContext';
import secondaryDataService from '../services/http/secondaryDataService';
import { validateField } from '../services/validationService';

// Create the context
const SecondaryDataSourceContext = createContext();

// Initial state specific to Secondary Data Source - aligned with secondarySchema
const initialState = {
  projectName: '',
  targetUrl: '',
  bidAmount: '',
  dailyBudget: '',
  targeting: {
    countries: [],
    devices: []
  },
  // Available options for selection - not part of schema validation
  availableCountries: [],
  availableDevices: [],
  fields: {
    projectName: {
      label: 'Project Name',
      type: 'text',
      required: true,
      validateField: (value, formData) => validateField('secondary', 'projectName', value, formData)
    },
    targetUrl: {
      label: 'Target URL',
      type: 'url',
      required: true,
      validateField: (value, formData) => validateField('secondary', 'targetUrl', value, formData)
    },
    bidAmount: {
      label: 'Bid Amount',
      type: 'number',
      required: true,
      validateField: (value, formData) => validateField('secondary', 'bidAmount', value, formData)
    },
    dailyBudget: {
      label: 'Daily Budget',
      type: 'number',
      required: true,
      validateField: (value, formData) => validateField('secondary', 'dailyBudget', value, formData)
    },
    targeting: {
      label: 'Targeting',
      type: 'group',
      validateField: (value, formData) => validateField('secondary', 'targeting', value, formData),
      fields: {
        countries: {
          label: 'Countries',
          type: 'multiselect',
          options: [],
          required: true,
          validateField: (value, formData) => validateField('secondary', 'targeting.countries', value, formData)
        },
        devices: {
          label: 'Devices',
          type: 'checkboxes',
          options: [],
          required: true,
          validateField: (value, formData) => validateField('secondary', 'targeting.devices', value, formData)
        }
      }
    }
  }
};

// Secondary-specific reducer actions
const secondaryActions = {
  SET_COUNTRIES: 'SET_COUNTRIES',
  SET_DEVICES: 'SET_DEVICES'
};

// Secondary-specific reducer
const secondaryReducer = (state, action) => {
  switch (action.type) {
    case secondaryActions.SET_COUNTRIES:
      return {
        ...state,
        availableCountries: action.payload
      };
    case secondaryActions.SET_DEVICES:
      return {
        ...state,
        availableDevices: action.payload
      };
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
  
  // Secondary-specific actions
  const setCountries = (countries) => {
    dispatch({ type: secondaryActions.SET_COUNTRIES, payload: countries });
  };
  
  const setDevices = (devices) => {
    dispatch({ type: secondaryActions.SET_DEVICES, payload: devices });
  };
  
  // Custom side effect - Load data from services on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set loading state
        setFieldLoading('targeting.countries', true);
        setFieldLoading('targeting.devices', true);
        
        // Load countries for targeting
        const {data: countries} = await secondaryDataService.getCountries();
        setCountries(countries);
        updateFieldOptions('targeting.countries', countries);
        setFieldLoading('targeting.countries', false);
        
        // Load devices for targeting
        const {data: devices} = await secondaryDataService.getDevices();
        setDevices(devices);
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
  }, []);
  
  // Create the context value with base actions and secondary-specific actions
  const contextValue = {
    ...baseContextValue,
    setCountries,
    setDevices,
    // No need to add fields again as it's already included in baseContextValue.state
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
