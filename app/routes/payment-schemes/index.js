const { getResponse } = require('../../payment-holds')
const ViewModel = require('./models/payment-schemes')
const azureAuth = require('../../azure-auth')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.viewPaymentScheme) {
        return h.redirect('/').code(401).takeover()
      }
      const paymentHoldsResponse = await getResponse('/payment-schemes')
      if (paymentHoldsResponse) {
        return h.view('payment-schemes', new ViewModel(paymentHoldsResponse.payload.paymentSchemes))
      }
      return h.view('no-response')
    }
  }
},
{
  method: 'POST',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.viewPaymentScheme) {
        return h.redirect('/').code(401).takeover()
      }
      const active = (request.payload.active === 'Active')
      const schemeId = request.payload.schemeId
      const name = request.payload.name
      return h.redirect(`/update-payment-scheme?schemeId=${schemeId}&active=${active}&name=${name}`)
    }
  }
}]
