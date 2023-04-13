const { getData } = require('./get-data')

const getPaymentsByCorrelationId = async (correlationId) => {
  return getData('correlationId', correlationId)
}

module.exports = {
  getPaymentsByCorrelationId
}
