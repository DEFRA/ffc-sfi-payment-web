const { getPaymentsByFrn } = require('./get-payments-by-frn')
const { getPaymentsByCorrelationId } = require('./get-payments-by-correlation-id')

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId
}
