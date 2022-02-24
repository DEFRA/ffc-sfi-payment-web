const { get } = require('../api')
const ViewModel = require('./models/scheme')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await get('/payment-schemes')
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
      const active = (request.payload.active === 'Active')
      const schemeId = request.payload.schemeId
      const name = request.payload.name
      return h.redirect(`/update-payment-scheme?schemeId=${schemeId}&active=${active}&name=${name}`)
    }
  }
}]
