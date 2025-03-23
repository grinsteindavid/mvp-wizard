import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewFieldRenderer from './ReviewFieldRenderer';

// Mock the styled components
jest.mock('../styled/WizardElements', () => ({
  ReviewItem: ({ children, ...props }) => <div data-testid="review-item" {...props}>{children}</div>,
  ItemLabel: ({ children, ...props }) => <div data-testid="item-label" {...props}>{children}</div>,
  ItemValue: ({ children, ...props }) => <div data-testid="item-value" {...props}>{children}</div>,
  SectionTitle: ({ children, ...props }) => <div data-testid="section-title" {...props}>{children}</div>
}));

describe('ReviewFieldRenderer', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  test('renders null when fieldData is not provided', () => {
    render(<ReviewFieldRenderer fieldData={null} />);
    expect(document.body.textContent).toBe('');
  });

  test('renders a simple field correctly', () => {
    const fieldData = {
      key: 'testField',
      label: 'Test Field',
      value: 'Test Value',
      type: 'text'
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('review-item')).toBeInTheDocument();
    expect(screen.getByTestId('item-label')).toHaveTextContent('Test Field');
    expect(screen.getByTestId('item-value')).toHaveTextContent('Test Value');
  });

  test('renders "Not specified" when field value is undefined', () => {
    const fieldData = {
      key: 'testField',
      label: 'Test Field',
      value: undefined,
      type: 'text'
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('item-value')).toHaveTextContent('Not specified');
  });

  test('renders "Not specified" when field value is null', () => {
    const fieldData = {
      key: 'testField',
      label: 'Test Field',
      value: null,
      type: 'text'
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('item-value')).toHaveTextContent('Not specified');
  });

  test('renders a group field with children correctly', () => {
    const fieldData = {
      key: 'groupField',
      label: 'Group Field',
      type: 'group',
      children: [
        {
          key: 'childField1',
          label: 'Child Field 1',
          value: 'Child Value 1',
          type: 'text'
        },
        {
          key: 'childField2',
          label: 'Child Field 2',
          value: 'Child Value 2',
          type: 'text'
        }
      ]
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Group Field');
    expect(screen.getAllByTestId('review-item')).toHaveLength(2);
    expect(screen.getAllByTestId('item-label')[0]).toHaveTextContent('Child Field 1');
    expect(screen.getAllByTestId('item-value')[0]).toHaveTextContent('Child Value 1');
    expect(screen.getAllByTestId('item-label')[1]).toHaveTextContent('Child Field 2');
    expect(screen.getAllByTestId('item-value')[1]).toHaveTextContent('Child Value 2');
  });

  test('renders a group field with no children correctly', () => {
    const fieldData = {
      key: 'groupField',
      label: 'Group Field',
      type: 'group',
      children: []
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Group Field');
    expect(screen.getByTestId('item-label')).toHaveTextContent('No group field data available');
  });

  test('renders an array field with items correctly', () => {
    const fieldData = {
      key: 'arrayField',
      label: 'Array Fields',
      type: 'array',
      count: 2,
      items: [
        {
          index: 0,
          fields: [
            {
              key: 'item1Field1',
              label: 'Item 1 Field 1',
              value: 'Value 1-1'
            },
            {
              key: 'item1Field2',
              label: 'Item 1 Field 2',
              value: 'Value 1-2'
            }
          ]
        },
        {
          index: 1,
          fields: [
            {
              key: 'item2Field1',
              label: 'Item 2 Field 1',
              value: 'Value 2-1'
            },
            {
              key: 'item2Field2',
              label: 'Item 2 Field 2',
              value: 'Value 2-2'
            }
          ]
        }
      ]
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Array Fields (2)');
    
    // We should have 4 review items (2 items × 2 fields each)
    expect(screen.getAllByTestId('review-item')).toHaveLength(4);
    
    // Check the heading for each array item
    const headings = screen.getAllByRole('heading', { level: 5 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Array Field 1');
    expect(headings[1]).toHaveTextContent('Array Field 2');
    
    // Check all field labels and values
    const labels = screen.getAllByTestId('item-label');
    const values = screen.getAllByTestId('item-value');
    
    expect(labels[0]).toHaveTextContent('Item 1 Field 1');
    expect(values[0]).toHaveTextContent('Value 1-1');
    expect(labels[1]).toHaveTextContent('Item 1 Field 2');
    expect(values[1]).toHaveTextContent('Value 1-2');
    expect(labels[2]).toHaveTextContent('Item 2 Field 1');
    expect(values[2]).toHaveTextContent('Value 2-1');
    expect(labels[3]).toHaveTextContent('Item 2 Field 2');
    expect(values[3]).toHaveTextContent('Value 2-2');
  });

  test('renders an array field with no items correctly', () => {
    const fieldData = {
      key: 'arrayField',
      label: 'Array Fields',
      type: 'array',
      count: 0,
      items: []
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Array Fields (0)');
    expect(screen.getByTestId('item-label')).toHaveTextContent('No array fields added');
  });

  test('renders an array item with no fields correctly', () => {
    const fieldData = {
      key: 'arrayField',
      label: 'Array Fields',
      type: 'array',
      count: 1,
      items: [
        {
          index: 0,
          fields: []
        }
      ]
    };

    render(<ReviewFieldRenderer fieldData={fieldData} />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Array Fields (1)');
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('Array Field 1');
    expect(screen.getByTestId('item-label')).toHaveTextContent('No data available');
  });
});
