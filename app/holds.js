const moment = require('moment')
const { get } = require('./api')
const { PAYMENT_ENDPOINT } = require('./constants/endpoints')

const getHolds = async () => {
  const { payload } = await get(PAYMENT_ENDPOINT, '/payment-holds')
  return payload.paymentHolds?.filter(x => x.dateTimeClosed == null).map(x => {
    x.dateTimeAdded = moment(x.dateTimeAdded).format('DD/MM/YYYY HH:mm')
    return x
  })
}

const getHoldCategories = async () => {
  const { payload } = await get(PAYMENT_ENDPOINT, '/payment-hold-categories')
  const schemes = [...new Set(payload.paymentHoldCategories.map(mapScheme))]
  return { schemes, paymentHoldCategories: payload.paymentHoldCategories }
}

const mapScheme = (scheme) => {
  if (scheme.schemeName === 'Vet Visits') {
    scheme.schemeName = 'Annual Health and Welfare Review'
  }
  return scheme.schemeName
}

module.exports = {
  getHolds,
  getHoldCategories
}
