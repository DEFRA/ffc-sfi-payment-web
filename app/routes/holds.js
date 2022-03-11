const schema = require('./schemas/hold')
const { get, post } = require('../api')
const auth = require('../auth')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      const paymentHoldsResponse = await get('/payment-holds')
      console.log(paymentHoldsResponse.payload)
      return h.view('payment-holds', { paymentHolds: paymentHoldsResponse.payload.paymentHolds?.filter(x => x.dateTimeClosed == null) })
    }
  }
}, {
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      const paymentHoldCategoriesResponse = await get('/payment-hold-categories')
      return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
        if (!permissions.holdAdmin) {
          return h.redirect('/').code(401).takeover()
        }
        const paymentHoldCategoriesResponse = await get('/payment-hold-categories')
        return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, errors: error, frn: request.payload.frn }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const permissions = await auth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      await post('/add-payment-hold', { holdCategoryId: request.payload.holdCategoryId, frn: request.payload.frn }, null)
      return h.redirect('/payment-holds')
    }
  }
},
{
  method: 'POST',
  path: '/remove-payment-hold',
  options: {
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
