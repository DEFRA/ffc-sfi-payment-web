const { SCHEME_VALUE } = require('../constants/scheme-value')
const { SCHEME_ID } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsByScheme = async (scheme = SCHEME_VALUE) => {
  return getData(SCHEME_ID, scheme)
}

module.exports = {
  getPaymentsByScheme
}
