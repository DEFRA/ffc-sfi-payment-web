const { getResponse, postRequest } = require('../payment-holds')
const azureAuth = require('../azure-auth')

module.exports = [{
  method: 'GET',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.removePaymentHold) {
        return h.redirect('/').code(401).takeover()
      }
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
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.removePaymentHold) {
        return h.redirect('/').code(401).takeover()
      }
      await postRequest('/remove-payment-hold', { holdId: request.payload.holdId })
      return h.redirect('/')
    }
  }
}]
