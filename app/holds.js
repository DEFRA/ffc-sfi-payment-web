const moment = require('moment')
const { get } = require('./api')

const getHolds = async () => {
  const { payload } = await get('/payment-holds')
  return payload.paymentHolds?.filter(x => x.dateTimeClosed == null).map(x => {
    x.dateTimeAdded = moment(x.dateTimeAdded).format('DD/MM/YYYY HH:mm')
    return x
  })
}

const getHoldCategories = async () => {
  const { payload } = await get('/payment-hold-categories')
  const schemes = [...new Set(payload.paymentHoldCategories.map((item) => {
    if (item.schemeName === 'Vet Visits') {
      item.schemeName = 'Annual Health and Welfare Review'
    }
    return item.schemeName
  }))]
  return { schemes, paymentHoldCategories: payload.paymentHoldCategories }
}

module.exports = {
  getHolds,
  getHoldCategories
}
