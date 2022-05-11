const Joi = require('joi')

module.exports = {
  frn: Joi.number().integer().greater(999999999).less(10000000000).required()
    .error(errors => {
      errors.forEach(err => { err.message = 'The FRN must be 10 digits' })
      return errors
    })
}
