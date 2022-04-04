const Joi = require('joi')

module.exports = Joi.object({
  invoiceNumber: Joi.string().required().error(errors => {
    errors.forEach(err => { err.message = 'Enter a valid invoice number' })
    return errors
  })
})
