const ViewModel = require('./models/update-payment-scheme')
// const postRequest  = require('../../payment-holds')
const { postRequest } = require('../../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/update-payment-scheme',
  options: {
    handler: async (request, h) => {
      return h.view('update-payment-scheme', new ViewModel(request.query))
    }
  }
},
{
  method: 'POST',
  path: '/update-payment-scheme',
  options: {
    handler: async (request, h) => {
      if(request.payload.scheme != request.payload.active) {
        await postRequest('/change-payment-status', { schemeId: request.payload.schemeId, active: request.payload.scheme})
      }
      return h.redirect('/payment-schemes')
    }
  }
}]
