# Workflow Wizard

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://grinsteindavid.github.io/mvp-wizard)


<img width="773" alt="image" src="https://github.com/user-attachments/assets/4e69f276-b831-45aa-bbe3-cabd5f610095" />

<img width="663" alt="image" src="https://github.com/user-attachments/assets/dfd9b3a4-5d1a-46d1-904e-4dd2090d4627" />


# Dynamic Form Wizard: A Powerful Context-Based Form System

## Overview

This Dynamic Form Wizard is a React application that demonstrates a powerful pattern for building complex, multi-step forms with dynamic field generation and validation. Unlike traditional form libraries that require hardcoding field definitions, this approach uses a context inheritance system that allows forms to adapt based on the selected data source or schema.

## Why You Should Care About This Pattern

If you've ever faced any of these challenges, this pattern is for you:

- **Creating different forms** for different data sources or APIs
- **Maintaining complex forms** with conditional fields and validation
- **Reducing boilerplate code** when working with multiple similar forms
- **Implementing wizard workflows** with varying steps based on user choices
- **Managing form state** without excessive prop drilling or Redux complexity

## The Dynamic Form Context System Explained

### Core Concept: Context Inheritance

The heart of this system is a clever context inheritance pattern:

1. **BaseDataSourceContext**: A foundational context that handles common form behavior:
   - Field value updates and tracking
   - Form validation state
   - Field loading states
   - Touched field tracking
   - Error state management

2. **Specialized Contexts**: (PrimaryDataSourceContext, SecondaryDataSourceContext, etc.) extend the base context:
   - Each defines its own field structure
   - Each provides source-specific validation rules
   - Each has its own state reducer for unique behaviors
   - All inherit common form handling from the base

```jsx
// Example of how contexts inherit core functionality while adding specifics
const { 
  combinedInitialState, 
  combinedReducer, 
  createContextValue 
} = createDataSourceBuilders(
  primaryInitialState,  // Source-specific state
  primaryReducer,       // Source-specific reducer
  primarySchema         // Source-specific validation schema
);
```

### How The Form System Works

#### 1. Dynamic Field Definitions

Fields are defined as JavaScript objects that specify:

```jsx
// Example field definition in context
fields: {
  projectName: {
    label: 'Project Name',
    type: 'text',
    required: true,
    value: '',
    description: 'A unique name to identify your content campaign'
  },
  budget: {
    label: 'Budget',
    type: 'number',
    required: true,
    value: '',
    description: 'Maximum spend for this campaign'
  }
}
```

#### 2. Schema-Based Validation

- Each data source has a corresponding Joi validation schema
- The contexts automatically validate against these schemas
- Validation runs on blur, on change, and on submission
- Error messages are tracked per field

#### 3. Smart Form Rendering

- Forms automatically render based on field definitions in context
- Field components adapt based on field type (text, select, multi-select, etc.)
- Review mode renders fields differently for confirmation

## How To Use This Pattern In Your Projects

### Example: Creating a New Form Type

```jsx
// 1. Define your schema
const myCustomSchema = Joi.object({
  name: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(1)
});

// 2. Create initial state with field definitions
const initialState = {
  fields: {
    name: {
      label: 'Name',
      type: 'text',
      required: true,
      value: ''
    },
    options: {
      label: 'Options',
      type: 'multi-select',
      required: true,
      value: [],
      options: ['Option A', 'Option B', 'Option C']
    }
  }
};

// 3. Create a custom context provider
const MyCustomProvider = ({ children }) => {
  // Use the builder pattern to create your context
  const { combinedInitialState, combinedReducer, createContextValue } = 
    createDataSourceBuilders(initialState, null, myCustomSchema);
  
  const [state, dispatch] = useReducer(combinedReducer, combinedInitialState);
  const contextValue = createContextValue(state, dispatch);
  
  return (
    <MyCustomContext.Provider value={contextValue}>
      {children}
    </MyCustomContext.Provider>
  );
};
```

### Using The Context In Components

```jsx
const MyFormComponent = () => {
  const { state, updateField, validateFieldOnBlur } = useMyCustomContext();
  
  return (
    <form>
      {Object.entries(state.fields).map(([fieldName, fieldConfig]) => (
        <FormField
          key={fieldName}
          name={fieldName}
          config={fieldConfig}
          error={state.errors[fieldName]}
          onChange={(value) => updateField(fieldName, value, myCustomSchema)}
          onBlur={() => validateFieldOnBlur(fieldName, myCustomSchema)}
        />
      ))}
    </form>
  );
};
```

## Practical Benefits

1. **Reduced Boilerplate**: Define fields once in context, use everywhere
2. **Consistent Validation**: Centralized schema validation for all fields
3. **Flexible Rendering**: Render fields differently based on context (edit vs. review)
4. **Extensible Design**: Easily add new form types by extending the base
5. **Type Safety**: Field structures are consistent and predictable
6. **Testing**: Isolated contexts are easy to test independently

## Project Structure

```
src/
├── contexts/              # Form context system
│   ├── BaseDataSourceContext.js         # Core form handling
│   ├── WizardContext.js                 # Navigation state
│   ├── PrimaryDataSourceContext.js      # Source-specific implementation
│   ├── SecondaryDataSourceContext.js    # Source-specific implementation
│   └── TertiaryDataSourceContext.js     # Source-specific implementation
├── schemas/              # Validation schemas for each data source
├── components/
│   ├── FormComponents/   # Reusable form elements
│   └── Wizard/           # Wizard-specific components
├── services/             # Mock data services
└── utils/                # Utility functions
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/grinsteindavid/mvp-wizard.git
cd mvp-wizard

# Install dependencies
npm install

# Start the development server
npm start
```

## Technology Stack

- **React**: UI library for building the interface
- **React Context API**: For state management without additional libraries
- **Styled Components**: For component-scoped styling with theme support
- **Joi**: Schema validation for robust data integrity

## Use Cases

This pattern excels in applications that need:

1. **Multi-step wizards** with dynamic field requirements
2. **Integration with multiple APIs** that have different field requirements
3. **Complex forms** with conditional logic and real-time validation
4. **Enterprise applications** where different departments need similar but distinct forms
5. **White-label solutions** that need to adapt to different client requirements

By adapting this pattern, you can dramatically reduce the amount of form-related code in your application while improving maintainability and user experience.

## License

MIT
