const schema = require('./schemas/frn')
const { getResponse, postRequest } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
<<<<<<< HEAD
      return h.view('add-payment-hold', {
        paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories
=======
      // const paymentSchemesResponse = await getResponse('/payment-schemes')
      return h.view('add-payment-hold', {
        paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories
        // paymentSchemes : paymentSchemesResponse.payload.paymentSchemes
>>>>>>> 9f8a73e (SFI-1033 : Add Scheme Information To Hold)
      })
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
      await postRequest('/add-payment-hold', { holdCategoryId: request.payload.holdCategory, frn: request.payload.frn }, null)
      return h.redirect('/')
    }
  }
}]
