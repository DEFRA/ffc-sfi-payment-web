const { get } = require('./api')
const { DATA_HUB_ENDPOINT } = require('./constants/endpoints')

const getPaymentsByFrn = async (frn) => {
  const { payload } = await get(DATA_HUB_ENDPOINT, `/payments/frn/${frn}`)
  return payload
}

const getPaymentsByCorrelationId = async (correlationId) => {
  const { payload } = await get(DATA_HUB_ENDPOINT, `/payments/correlation-id/${correlationId}`)
  return payload
}

module.exports = {
  getPaymentsByFrn,
  getPaymentsByCorrelationId
}
