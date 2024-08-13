const { SCHEME_ID } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsByScheme = async (scheme) => {
  return getData(SCHEME_ID, scheme)
}

module.exports = {
  getPaymentsByScheme
}
