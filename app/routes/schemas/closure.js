const Joi = require('joi')

module.exports = Joi.object({
  frn: Joi.number().integer().min(1000000000).max(9999999999).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a 10-digit FRN' })
    return errors
  }),
  agreement: Joi.string().required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid agreement number' })
    return errors
  }),
  day: Joi.number().integer().min(1).max(31).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid day' })
    return errors
  }),
  month: Joi.number().integer().min(1).max(12).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid month' })
    return errors
  }),
  year: Joi.number().integer().min(2023).max(2099).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid year' })
    return errors
  })
})
