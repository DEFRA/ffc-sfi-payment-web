const Joi = require('joi')

module.exports = Joi.object({
  frn: Joi.number().integer().min(1000000000).max(9999999999).required().error(errors => {
    errors.forEach(err => { err.message = 'Enter an FRN' })
    return errors
  }),
  holdCategoryId: Joi.number().integer().required().error(errors => {
    errors.forEach(err => { err.message = 'Category is required' })
    return errors
  })
})
