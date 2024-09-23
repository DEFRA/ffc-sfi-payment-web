const Joi = require('joi')
const { CS, BPS } = require('../../constants/schemes')

module.exports = Joi.object({
  frn: Joi.number().integer().greater(999999999).less(10000000000).empty('').optional()
    .error(errors => {
      errors.forEach(err => { err.message = 'The FRN, if present, must be 10 digits' })
      return errors
    }),

  year: Joi.number().integer().greater(1993).less(2099)
    .when('schemeId', {
      is: Joi.number().integer().valid(CS),
      then: Joi.optional().allow(''),
      otherwise: Joi.required()
        .error(errors => {
          errors.forEach(err => { err.message = 'A valid year must be provided' })
          return errors
        })
    }),

  prn: Joi.number().integer()
    .when('schemeId', {
      is: Joi.number().integer().valid(BPS),
      then: Joi.required()
        .error(errors => {
          errors.forEach(err => { err.message = 'Provide a payment request number' })
          return errors
        }),
      otherwise: Joi.allow('')
        .error(errors => {
          return errors
        })
    }),

  revenueOrCapital: Joi.string().allow('', 'Revenue', 'Capital')
    .when('schemeId', {
      is: Joi.number().integer().valid(CS),
      then: Joi.required().valid('Revenue', 'Capital')
        .error(errors => {
          errors.forEach(err => { err.message = 'Select Revenue or Capital' })
          return errors
        }),
      otherwise: Joi.valid('')
        .error(errors => {
          errors.forEach(err => { err.message = 'Revenue/Capital should not be selected for this scheme' })
          return errors
        })
    }),

  schemeId: Joi.number().integer().required()
    .error(errors => {
      errors.forEach(err => { err.message = 'A scheme must be selected' })
      return errors
    })
})
