const { FRN } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsByFrn = async (frn) => {
  return getData(FRN, frn)
}

module.exports = {
  getPaymentsByFrn
}
