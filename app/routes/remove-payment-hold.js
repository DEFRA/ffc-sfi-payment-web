const { getPaymentHoldResponse } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/payment-holds/remove',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await getPaymentHoldResponse('/payment-holds')
      return h.view('remove-payment-hold', { paymentHolds: paymentHoldsResponse.payload })
    }
  }
},
{
  method: 'POST',
  path: '/payment-holds/remove',
  options: {
    handler: async (request, h) => {
      // const paymentHoldResponse = await getPaymentHoldResponse('/payment-holds')
      return h.view('payment-holds')
    }
  }
}]
