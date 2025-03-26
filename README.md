# Workflow Wizard

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://grinsteindavid.github.io/mvp-wizard)


<img width="773" alt="image" src="https://github.com/user-attachments/assets/4e69f276-b831-45aa-bbe3-cabd5f610095" />

## Overview

Workflow Wizard is a React-based multi-step form application that guides users through creating and managing projects across multiple data sources. It provides a streamlined, wizard-like interface for collecting and validating information specific to different data source integrations, with dynamic forms that adapt to each data source's unique requirements.

## Features

- **Multi-step Wizard Interface**: Guided step-by-step process for project creation with intuitive navigation
- **Data Source Selection**: Support for multiple data source integrations (Primary, Secondary, Tertiary) with source-specific workflows
- **Dynamic Form Generation**: Forms that automatically adapt based on the selected data source's schema and requirements
- **Schema-based Validation**: Comprehensive validation using Joi schemas with real-time feedback
- **Context-based State Management**: Clean separation of navigation and data concerns through React Context API
- **Mock Service Layer**: Simulated API interactions with mock data aligned to schemas
- **Responsive Design**: Mobile-friendly interface using styled-components

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Components

1. **Wizard Component**: The main component orchestrating the wizard flow and step transitions
2. **WizardContext**: Manages navigation state, step progression, and selected data source
3. **Data Source Contexts**: Handle data source-specific form data, validation, and state management
4. **Form Components**: Reusable form elements with consistent validation support
5. **Validation Service**: Centralized validation using Joi schemas for data integrity
6. **Data Services**: Service classes that provide mock data for available options

### Dynamic Form System

The wizard's dynamic form system is powered by:

1. **Context Inheritance**: Each data source context extends a BaseDataSourceContext, providing a consistent interface while allowing source-specific customization
2. **Field Definitions**: Each context defines its own set of fields with validation rules and available options
3. **ReviewFieldRenderer**: Specialized component that renders form fields differently in review mode
4. **Field Components**: Reusable components like TextField that provide consistent UI and behavior

### Schema-based Validation

Validation is handled through:

1. **Source-specific Schemas**: Each data source has a dedicated schema that defines structure and validation rules
2. **Real-time Validation**: As users input data, forms validate against schemas, providing immediate feedback
3. **Consistent Schema Naming**: Clean schema organization with consistent naming conventions

### Service Layer with Mock Data

The application simulates API interactions through:

1. **Data Services**: PrimaryDataService, SecondaryDataService, and TertiaryDataService provide mock data
2. **Clean Data Structure**: Services contain only mock data that aligns with their respective schemas
3. **Available Options**: Services provide data for selection fields (bidStrategies, countries, devices, objectives)

### Wizard Flow

1. **Source Selection Step**: User selects a data source (Primary, Secondary, Tertiary)
2. **Project Setup Step**: User fills out a form with fields specific to the selected data source
3. **Review Step**: User reviews the entered information before submission

### Context Structure

- **WizardContext**: Handles navigation state (current step, selected data source)
- **BaseDataSourceContext**: Provides common functionality for all data source contexts
- **Specific Data Source Contexts**: Extend the base context with source-specific fields and validation

## Technology Stack

- **React**: UI library for building the interface
- **React Context API**: For state management without additional libraries
- **Styled Components**: For component-scoped styling with theme support
- **Joi**: Schema validation for robust data integrity
- **React Router**: For navigation between wizard steps

## Project Structure

```
src/
├── components/
│   ├── FormComponents/    # Reusable form elements
│   └── Wizard/            # Wizard-specific components
│       ├── Steps/         # Step components
│       ├── components/    # Wizard sub-components
│       ├── styled/        # Styled components
│       └── utils/         # Utility functions
├── contexts/              # React contexts for state management
├── schemas/               # Validation schemas for each data source
├── services/              # Mock data services
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/grinsteindavid/mvp-wizard.git
cd mvp-wizard

# Install dependencies
npm install

# Start the development server
npm start
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Why This Project Is Powerful

1. **Extensibility**: Easily add new data sources without changing core wizard logic
2. **Maintainability**: Clear separation of concerns makes the codebase easier to maintain
3. **User Experience**: Step-by-step approach simplifies complex form filling
4. **Validation Robustness**: Joi schema validation ensures data integrity
5. **Adaptability**: The same wizard framework can be applied to various business domains
6. **Testing**: Comprehensive tests verify the behavior of contexts, schemas, and components

## Extending the Wizard

### Adding a New Data Source

1. Create a new data source context in `/src/contexts/`
2. Create a validation schema in `/src/schemas/`
3. Create a service with mock data in `/src/services/`
4. Update the `DataSourceFactory` to include the new source
5. Add the new source to the selection options in `SourceSelectionStep`

### Customizing Form Fields

Form fields are defined in each data source context. To customize fields:

1. Modify the field definitions in the relevant data source context
2. Update the validation schema to match the new field requirements
3. Add any necessary mock data to the corresponding service

## License

MIT
