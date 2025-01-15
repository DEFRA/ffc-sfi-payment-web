const Joi = require('joi')

const minDate = 1
const maxDateDay = 31
const maxDateMonth = 12
const minYear = 2015

const createDatePartSchema = (min, max) => {
  return Joi.number().integer().min(min).max(max).allow('').optional()
}

const validateCompleteDate = (value, helpers) => {
  const startDay = value['start-date-day']
  const startMonth = value['start-date-month']
  const startYear = value['start-date-year']
  const endDay = value['end-date-day']
  const endMonth = value['end-date-month']
  const endYear = value['end-date-year']

  if (
    (startDay || startMonth || startYear) &&
    (!startDay || !startMonth || !startYear)
  ) {
    return helpers.message('Start date must include day, month, and year')
  }

  if ((endDay || endMonth || endYear) && (!endDay || !endMonth || !endYear)) {
    return helpers.message('End date must include day, month, and year')
  }

  if (startYear && endYear) {
    const startDate = new Date(startYear, startMonth - 1, startDay)
    const endDate = new Date(endYear, endMonth - 1, endDay)
    if (endDate < startDate) {
      return helpers.message('End date cannot be less than start date')
    }
  }

  return value
}

const getSchema = () => {
  const yearNow = new Date().getFullYear()

  return Joi.object({
    'start-date-day': createDatePartSchema(minDate, maxDateDay),
    'start-date-month': createDatePartSchema(minDate, maxDateMonth),
    'start-date-year': createDatePartSchema(minYear, yearNow),
    'end-date-day': createDatePartSchema(minDate, maxDateDay),
    'end-date-month': createDatePartSchema(minDate, maxDateMonth),
    'end-date-year': createDatePartSchema(minYear, yearNow)
  }).custom(validateCompleteDate)
}

module.exports = getSchema()
