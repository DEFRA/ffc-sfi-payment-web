const { get } = require('./api')
const { DATA_HUB_ENDPOINT } = require('./constants/endpoints')

const getPaymentsByFrn = async (frn) => {
  const { payload } = await get(DATA_HUB_ENDPOINT, `/payments/${frn}`)
  return payload
}

module.exports = {
  getPaymentsByFrn
}
