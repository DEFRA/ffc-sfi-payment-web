const schema = require('./schemas/hold')
const { post } = require('../api')
const { holdAdmin } = require('../auth/permissions')
const { getHolds, getHoldCategories } = require('../holds')

module.exports = [{
  method: 'GET',
  path: '/payment-holds',
  options: {
    auth: { scope: [holdAdmin] },
    handler: async (_request, h) => {
      const paymentHolds = await getHolds()
      return h.view('payment-holds', { paymentHolds })
    }
  }
}, {
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    auth: { scope: [holdAdmin] },
    handler: async (_request, h) => {
      const { schemes, paymentHoldCategories } = await getHoldCategories()
      return h.view('add-payment-hold', { schemes, paymentHoldCategories })
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
        const { schemes, paymentHoldCategories } = await getHoldCategories()
        return h.view('add-payment-hold', { schemes, paymentHoldCategories, errors: error, frn: request.payload.frn }).code(400).takeover()
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
      await post('/remove-payment-hold', { holdId: request.payload.holdId })
      return h.redirect('/')
    }
  }
}]
