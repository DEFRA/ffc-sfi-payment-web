const { getPaymentsByFrn } = require('./get-payments-by-frn')
const { getPaymentsByCorrelationId } = require('./get-payments-by-correlation-id')
const { getPaymentsBySchemeId } = require('./get-payments-by-scheme-id')

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId,
  getPaymentsBySchemeId
}
