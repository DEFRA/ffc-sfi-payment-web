const Joi = require('joi')

module.exports = Joi.object({
  frn: Joi.number().integer().min(1000000000).max(9999999999).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a 10-digit FRN' })
    return errors
  })
})
