const Joi = require('joi').extend(require('@joi/date'))

module.exports = Joi.object({
  frn: Joi.number().integer().min(1000000000).max(9999999999).required().error(errors => {
    errors.forEach(err => { err.message = 'A provided FRN is not in the required format' })
    return errors
  })
})
