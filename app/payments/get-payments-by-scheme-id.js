const { SCHEME_ID } = require('../constants/categories')
const { SCHEME_ID_VALUE } = require('../constants/scheme-id-value')
const { getData } = require('./get-data')

const getPaymentsBySchemeId = async (schemeId = SCHEME_ID_VALUE) => {
  return getData(SCHEME_ID, schemeId)
}

module.exports = {
  getPaymentsBySchemeId
}
