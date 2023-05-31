const { SCHEME_ID } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsBySchemeId = async (schemeId = '1') => {
  return getData(SCHEME_ID, schemeId)
}

module.exports = {
  getPaymentsBySchemeId
}
