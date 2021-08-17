const { getResponse, postRequest } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await getResponse('/payment-holds?open=true')
      return h.view('remove-payment-hold', { paymentHolds: paymentHoldsResponse.payload.paymentHolds })
    }
  }
},
{
  method: 'POST',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      await postRequest('/remove-payment-hold', { holdId: request.payload.holdId })
      return h.redirect('/')
    }
  }
}]
