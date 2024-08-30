const Joi = require('joi')

module.exports = Joi.object({
  frn: Joi.number().integer().greater(999999999).less(10000000000).empty('').optional()
    .error(errors => {
      errors.forEach(err => { err.message = 'The FRN, if present, must be 10 digits' })
      return errors
    }),
  schemeId: Joi.number().integer().required()
    .error(errors => {
      errors.forEach(err => { err.message = 'A scheme must be selected' })
      return errors
    })
})
