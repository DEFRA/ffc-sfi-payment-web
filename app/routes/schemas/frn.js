const joi = require('joi')

module.exports = joi.object({
  frn: joi.number().integer().greater(999999999).less(10000000000).required(),
  holdCategory: joi.string().required()
  // paymentScheme: joi.string().required()
}).error(errors => {
  errors.forEach(err => {
    switch (err.code) {
      case 'number.less':
        err.message = 'The FRN is too long.'
        break
      case 'number.greater':
        err.message = 'The FRN is too short.'
        break
      case 'number.unsafe':
        err.message = 'The FRN is too long.'
        break
      case 'number.base':
        err.message = 'The FRN must be a number.'
        break
      default:
        err.message = 'The FRN is invalid.'
        break
    }
  })
  return errors
})
