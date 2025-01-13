const Joi = require('joi')

const getSchema = () => {
  const yearNow = new Date().getFullYear()
  const datePartDaySchema = Joi.number().integer().min(1).max(31).allow('').optional()
  const datePartMonthSchema = Joi.number().integer().min(1).max(12).allow('').optional()
  const datePartYearSchema = Joi.number().integer().min(2015).max(yearNow).allow('').optional()

  return Joi.object({
    'start-date-day': datePartDaySchema.messages({
      'number.base': 'Start date day must be a number',
      'number.integer': 'Start date day must be an integer',
      'number.min': 'Start date day cannot be less than 1',
      'number.max': 'Start date day cannot be more than 31'
    }),
    'start-date-month': datePartMonthSchema.messages({
      'number.base': 'Start date month must be a number',
      'number.integer': 'Start date month must be an integer',
      'number.min': 'Start date month cannot be less than 1',
      'number.max': 'Start date month cannot be more than 12'
    }),
    'start-date-year': datePartYearSchema.messages({
      'number.base': 'Start date year must be a number',
      'number.integer': 'Start date year must be an integer',
      'number.min': 'Start date year cannot be less than 2015',
      'number.max': 'Start date year cannot be more than current year'
    }),
    'end-date-day': datePartDaySchema.messages({
      'number.base': 'End date day must be a number',
      'number.integer': 'End date day must be an integer',
      'number.min': 'End date day cannot be less than 1',
      'number.max': 'End date day cannot be more than 31'
    }),
    'end-date-month': datePartMonthSchema.messages({
      'number.base': 'End date month must be a number',
      'number.integer': 'End date month must be an integer',
      'number.min': 'End date month cannot be less than 1',
      'number.max': 'End date month cannot be more than 12'
    }),
    'end-date-year': datePartYearSchema.messages({
      'number.base': 'End date year must be a number',
      'number.integer': 'End date year must be an integer',
      'number.min': 'End date year cannot be less than current year',
      'number.max': 'End date year cannot be more than current year'
    })
  }).options({ abortEarly: false })
    .custom((value, helpers) => {
      const startDateParts = ['start-date-day', 'start-date-month', 'start-date-year']
      const endDateParts = ['end-date-day', 'end-date-month', 'end-date-year']

      const startDateProvided = startDateParts.every(part => value[part] !== '')
      const endDateProvided = endDateParts.every(part => value[part] !== '')

      if (!startDateProvided && startDateParts.some(part => value[part] !== '')) {
        return helpers.message('Start date must include day, month, and year')
      }

      if (!endDateProvided && endDateParts.some(part => value[part] !== '')) {
        return helpers.message('End date must include day, month, and year')
      }

      if (startDateProvided && endDateProvided) {
        const startDate = new Date(value['start-date-year'], value['start-date-month'] - 1, value['start-date-day'])
        const endDate = new Date(value['end-date-year'], value['end-date-month'] - 1, value['end-date-day'])

        if (endDate < startDate) {
          return helpers.message('End date cannot be less than start date')
        }
      }

      return value
    })
}
module.exports = getSchema()
