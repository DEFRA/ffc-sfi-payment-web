const { get } = require('../api')
const { holdAdmin, schemeAdmin } = require('../auth/permissions')
const { PAYMENT_ENDPOINT } = require('../constants/endpoints')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin] },
    handler: async (_request, h) => {
      const paymentHoldsResponse = await get(PAYMENT_ENDPOINT, '/payment-holds')
      const schemes = await get(PAYMENT_ENDPOINT, '/payment-schemes')
      return h.view('home', {
        totalHolds: paymentHoldsResponse?.payload?.paymentHolds?.filter(x => x.dateTimeClosed == null).length ?? 0,
        totalSchemes: schemes?.payload?.paymentSchemes?.length ?? 0
      })
    }
  }
}
