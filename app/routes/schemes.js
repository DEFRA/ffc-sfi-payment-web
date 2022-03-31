const { get, post } = require('../api')
const Joi = require('joi')
const ViewModel = require('./models/update-scheme')
const auth = require('../auth')
const { schemeAdmin } = require('../auth/permissions')

module.exports = [{
  method: 'GET',
  path: '/payment-schemes',
  options: {
    auth: { scope: [schemeAdmin] },
    handler: async (request, h) => {
      const schemes = await get('/payment-schemes')
      return h.view('payment-schemes', { schemes: schemes.payload.paymentSchemes })
    }
  }
},
{
  method: 'POST',
  path: '/payment-schemes',
  options: {
    auth: { scope: [schemeAdmin] },
    handler: async (request, h) => {
      const active = request.payload.active
      const schemeId = request.payload.schemeId
      const name = request.payload.name
      return h.redirect(`/update-payment-scheme?schemeId=${schemeId}&active=${active}&name=${name}`)
    }
  }
}, {
  method: 'GET',
  path: '/update-payment-scheme',
  options: {
    auth: { scope: [schemeAdmin] },
    validate: {
      query: Joi.object({
        schemeId: Joi.number().required(),
        name: Joi.string().required(),
        active: Joi.boolean().required()
      })
    },
    handler: async (request, h) => {
      return h.view('update-payment-scheme', new ViewModel(request.query))
    }
  }
},
{
  method: 'POST',
  path: '/update-payment-scheme',
  options: {
    auth: { scope: [schemeAdmin] },
    validate: {
      payload: Joi.object({
        confirm: Joi.boolean().required(),
        schemeId: Joi.number().required(),
        name: Joi.string().required(),
        active: Joi.boolean().required()
      }),
      failAction: async (request, h, error) => {
        const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
        if (!permissions.schemeAdmin) {
          return h.redirect('/').code(401).takeover()
        }
        return h.view('update-payment-scheme', new ViewModel(request.payload, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.schemeAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      if (request.payload.confirm) {
        await post('/change-payment-status', { schemeId: request.payload.schemeId, active: !request.payload.active })
      }
      return h.redirect('/payment-schemes')
    }
  }
}]
