const Joi = require('joi')
const fileSchema = require('./file-schema')

module.exports = Joi.object({
  remove: Joi.boolean().required().error(errors => {
    errors.forEach(err => { err.message = 'Select add to add holds in bulk' })
    return errors
  }),
  holdCategoryId: Joi.number().integer().required().error(errors => {
    errors.forEach(err => { err.message = 'Category is required' })
    return errors
  }),
  file: fileSchema.error(errors => {
    errors[0].message = 'Provide a CSV file'
    return errors[0]
  })
})
