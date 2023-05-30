const { BATCH } = require('../constants/categories')
const { getData } = require('./get-data')

const getPaymentsByBatch = async (batch) => {
  return getData(BATCH, batch)
}

module.exports = {
  getPaymentsByBatch
}
