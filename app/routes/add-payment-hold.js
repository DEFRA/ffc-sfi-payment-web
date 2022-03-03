const schema = require('./schemas/frn')
const { getResponse, postRequest } = require('../payment-holds')
const azureAuth = require('../azure-auth')

module.exports = [{
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
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
        const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
        return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, errors: error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const permissions = await azureAuth.refresh(request.auth.credentials.account, request.cookieAuth)
      if (!permissions.holdAdmin) {
        return h.redirect('/').code(401).takeover()
      }
      await postRequest('/add-payment-hold', { holdCategoryId: request.payload.holdCategory, frn: request.payload.frn }, null)
      return h.redirect('/')
    }
  }
}]
