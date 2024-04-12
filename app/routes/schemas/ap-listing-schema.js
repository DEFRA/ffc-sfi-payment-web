const Joi = require('joi')

module.exports = Joi.object({
  'start-date-day': Joi.number().integer().min(1).max(31).allow('').optional().messages({
    'number.base': 'Day must be a number',
    'number.integer': 'Day must be an integer',
    'number.min': 'Day cannot be less than 1',
    'number.max': 'Day cannot be more than 31',
  }),
  'start-date-month': Joi.number().integer().min(1).max(12).allow('').optional().messages({
    'number.base': 'Month must be a number',
    'number.integer': 'Month must be an integer',
    'number.min': 'Month cannot be less than 1',
    'number.max': 'Month cannot be more than 12',
  }),
  'start-date-year': Joi.number().integer().min(2015).max(new Date().getFullYear()).allow('').optional().messages({
    'number.base': 'Year must be a number',
    'number.integer': 'Year must be an integer',
    'number.min': 'Year cannot be less than 2015',
    'number.max': 'Year cannot be in the future',
  }),
  'end-date-day': Joi.number().integer().min(1).max(31).allow('').optional().messages({
    'number.base': 'Day must be a number',
    'number.integer': 'Day must be an integer',
    'number.min': 'Day cannot be less than 1',
    'number.max': 'Day cannot be more than 31',
  }),
  'end-date-month': Joi.number().integer().min(1).max(12).allow('').optional().messages({
    'number.base': 'Month must be a number',
    'number.integer': 'Month must be an integer',
    'number.min': 'Month cannot be less than 1',
    'number.max': 'Month cannot be more than 12',
  }),
  'end-date-year': Joi.number().integer().min(2015).max(new Date().getFullYear()).allow('').optional().messages({
    'number.base': 'Year must be a number',
    'number.integer': 'Year must be an integer',
    'number.min': 'Year cannot be less than 2015',
    'number.max': 'Year cannot be in the future',
  })
})
