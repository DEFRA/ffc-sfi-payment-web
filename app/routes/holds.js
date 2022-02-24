const schema = require('./schemas/hold')
const { get, post } = require('../api')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await get('/payment-holds')
      return h.view('payment-holds', { paymentHolds: paymentHoldsResponse.payload.paymentHolds })
    }
  }
}, {
  method: 'GET',
  path: '/add-payment-hold',
  options: {
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
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        const paymentHoldCategoriesResponse = await get('/payment-hold-categories')
        return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, errors: error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/add-payment-hold', { holdCategoryId: request.payload.holdCategoryId, frn: request.payload.frn }, null)
      return h.redirect('/payment-holds')
    }
  }
}, {
  method: 'GET',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await get('/payment-holds?open=true')
      return h.view('remove-payment-hold', { paymentHolds: paymentHoldsResponse.payload.paymentHolds })
    }
  }
},
{
  method: 'POST',
  path: '/remove-payment-hold',
  options: {
    handler: async (request, h) => {
      await post('/remove-payment-hold', { holdId: request.payload.holdId })
      return h.redirect('/')
    }
  }
}]
