const Joi = require('joi').extend(require('@joi/date'))

module.exports = Joi.object({
  frn: Joi.number().integer().min(1000000000).max(9999999999).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a 10-digit FRN' })
    return errors
  }),
  agreementNumber: Joi.string().required().max(50).error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid agreement number' })
    return errors
  }),
  closureDate: Joi.date().format('YYYY-MM-DD').required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid date' })
    return errors
  })
})
