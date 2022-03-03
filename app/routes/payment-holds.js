const { getResponse } = require('../payment-holds')
const azureAuth = require('../azure-auth')

module.exports = {
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      const paymentHoldsResponse = await getResponse('/payment-holds')
      return h.view('payment-holds', { paymentHolds: paymentHoldsResponse.payload.paymentHolds })
    }
  }
}
