const { getPaymentHoldResponse } = require('../payment-holds')

module.exports = {
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await getPaymentHoldResponse('/payment-holds')
      return h.view('payment-holds', { paymentHolds: paymentHoldsResponse.payload.paymentHolds })
    }
  }
}
