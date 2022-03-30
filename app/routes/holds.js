const schema = require('./schemas/hold')
const { get, post } = require('../api')
const auth = require('../auth')
const { holdAdmin } = require('../auth/permissions')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    auth: { scope: [holdAdmin] },
    handler: async (request, h) => {
      const paymentHoldsResponse = await get('/payment-holds')
      return h.view('payment-holds', { paymentHolds: paymentHoldsResponse.payload.paymentHolds?.filter(x => x.dateTimeClosed == null) })
    }
  }
}, {
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    auth: { scope: [holdAdmin] },
    handler: async (request, h) => {
      const paymentHoldCategoriesResponse = await get('/payment-hold-categories')
      return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    auth: { scope: [holdAdmin] },
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        const paymentHoldCategoriesResponse = await get('/payment-hold-categories')
        return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, errors: error, frn: request.payload.frn }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/add-payment-hold', { holdCategoryId: request.payload.holdCategoryId, frn: request.payload.frn }, null)
      return h.redirect('/payment-holds')
    }
  }
},
{
  method: 'POST',
  path: '/remove-payment-hold',
  options: {
    auth: { scope: [holdAdmin] },
    handler: async (request, h) => {
      const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      await post('/remove-payment-hold', { holdId: request.payload.holdId })
      return h.redirect('/')
    }
  }
}]
