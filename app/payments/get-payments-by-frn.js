const { getData } = require('./get-data')

const getPaymentsByFrn = async (frn) => {
  return getData('frn', frn)
}

module.exports = {
  getPaymentsByFrn
}
