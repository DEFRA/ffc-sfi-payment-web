const { CORRELATION_ID } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsByCorrelationId = async (correlationId) => {
  return getData(CORRELATION_ID, correlationId)
}

module.exports = {
  getPaymentsByCorrelationId
}
