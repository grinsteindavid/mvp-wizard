import Joi from 'joi';
import baseSchema from './baseSchema';

// Tertiary data source validation schema builder
const createTertiarySchema = () => Joi.object({
  ...baseSchema,
  projectObjective: Joi.string().valid('visits', 'awareness', 'conversions').required().messages({
    'any.only': 'Please select a valid project objective',
    'any.required': 'Project objective is required'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).allow(null, '').messages({
    'date.base': 'End date must be a valid date',
    'date.min': 'End date must be after start date'
  }),
  budget: Joi.object({
    amount: Joi.number().min(10).required().messages({
      'number.base': 'Budget amount must be a number',
      'number.min': 'Budget amount must be at least $10',
      'any.required': 'Budget amount is required'
    }),
    type: Joi.string().valid('daily', 'lifetime').required().messages({
      'any.only': 'Please select a valid budget type',
      'any.required': 'Budget type is required',
      'string.empty': 'Budget type cannot be empty'
    })
  }).required(),
  bidding: Joi.object({
    strategy: Joi.string().valid('manual', 'auto').required().messages({
      'any.only': 'Please select a valid bid strategy',
      'any.required': 'Bid strategy is required',
      'string.empty': 'Bid strategy cannot be empty'
    }),
    amount: Joi.when('strategy', {
      is: 'manual',
      then: Joi.number().min(0.01).required().messages({
        'number.base': 'Bid amount must be a number',
        'number.min': 'Bid amount must be at least $0.01',
        'any.required': 'Bid amount is required for manual bidding'
      }),
      otherwise: Joi.any().allow(null, '')
    })
  }).required()
});

export default createTertiarySchema;
