const { getPaymentsByFrn } = require('./get-payments-by-frn')
const { getPaymentsByCorrelationId } = require('./get-payments-by-correlation-id')
const { getPaymentsByScheme } = require('./get-payments-by-scheme')
const { getPaymentsByBatch } = require('./get-payments-by-batch')

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId,
  getPaymentsByScheme,
  getPaymentsByBatch
}
