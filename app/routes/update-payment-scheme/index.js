const joi = require('joi')
const ViewModel = require('./models/update-payment-scheme')
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
    validate: {
      payload: joi.object({
        scheme: joi.any().required(),
        schemeId: joi.any().required(),
        name: joi.any().required(),
        active: joi.any().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('update-payment-scheme', new ViewModel(request.payload, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      if (request.payload.scheme === 'true') {
        let toggle = true
        if (request.payload.active === 'true') {
          toggle = false
        }
        await postRequest('/change-payment-status', { schemeId: request.payload.schemeId, active: toggle })
      }
      return h.redirect('/payment-schemes')
    }
  }
}]
