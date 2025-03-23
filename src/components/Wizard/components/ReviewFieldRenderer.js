import React from 'react';
import {
  ReviewItem,
  ItemLabel,
  ItemValue,
  SectionTitle
} from '../styled/WizardElements';

/**
 * Component that renders a field or field group for the review step
 * @param {object} fieldData - Processed field data from prepareFieldValue
 */
const ReviewFieldRenderer = ({ fieldData }) => {
  if (!fieldData) return null;
  
  // Handle group fields (like targeting)
  if (fieldData.type === 'group') {
    return (
      <div key={fieldData.key} style={{ marginBottom: '20px' }}>
        <SectionTitle>{fieldData.label}</SectionTitle>
        <div style={{ marginLeft: '16px' }}>
          {Array.isArray(fieldData.children) && fieldData.children.length > 0 ? (
            fieldData.children.map(childField => (
              <ReviewFieldRenderer key={childField.key} fieldData={childField} />
            ))
          ) : (
            <ReviewItem>
              <ItemLabel>No {fieldData.label.toLowerCase()} data available</ItemLabel>
            </ReviewItem>
          )}
        </div>
      </div>
    );
  }
  
  // Handle array fields
  if (fieldData.type === 'array') {
    return (
      <div key={fieldData.key} style={{ marginBottom: '20px' }}>
        <SectionTitle>
          {fieldData.label} ({fieldData.count || 0})
        </SectionTitle>
        {Array.isArray(fieldData.items) && fieldData.items.length > 0 ? (
          fieldData.items.map((item) => (
            <div 
              key={`${fieldData.key}-${item.index}`} 
              style={{ 
                marginLeft: '16px', 
                marginBottom: '16px', 
                padding: '12px',
                border: '1px solid #eee',
                borderRadius: '4px'
              }}
            >
              <h5 style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                {fieldData.label.replace(/s$/, '')} {item.index + 1}
              </h5>
              {Array.isArray(item.fields) && item.fields.length > 0 ? (
                item.fields.map(field => (
                  <ReviewItem key={field.key}>
                    <ItemLabel>{field.label}</ItemLabel>
                    <ItemValue>{field.value}</ItemValue>
                  </ReviewItem>
                ))
              ) : (
                <ReviewItem>
                  <ItemLabel>No data available</ItemLabel>
                </ReviewItem>
              )}
            </div>
          ))
        ) : (
          <div style={{ marginLeft: '16px' }}>
            <ReviewItem>
              <ItemLabel>No {fieldData.label.toLowerCase()} added</ItemLabel>
            </ReviewItem>
          </div>
        )}
      </div>
    );
  }
  
  // Default case: simple field
  return (
    <ReviewItem key={fieldData.key}>
      <ItemLabel>{fieldData.label}</ItemLabel>
      <ItemValue>
        {fieldData.value !== undefined && fieldData.value !== null 
          ? fieldData.value 
          : 'Not specified'}
      </ItemValue>
    </ReviewItem>
  );
};

export default ReviewFieldRenderer;
