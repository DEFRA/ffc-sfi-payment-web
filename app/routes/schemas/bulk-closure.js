const Joi = require('joi')
const fileSchema = require('./file-schema')

module.exports = Joi.object({
  file: fileSchema.error(errors => {
    errors[0].message = 'Provide a CSV file'
    return errors[0]
  })
})
