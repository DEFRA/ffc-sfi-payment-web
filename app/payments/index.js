const { getPaymentsByFrn } = require('./get-payments-by-frn')
const { getPaymentsByCorrelationId } = require('./get-payments-by-correlation-id')
const { getPaymentsByBatch } = require('./get-payments-by-batch')

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId,
  getPaymentsByBatch
}
