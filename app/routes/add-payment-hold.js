const { getResponse, postRequest } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategoriesResponse = await getResponse('/payment-hold-categories')
      const paymentHoldFRNsResponse = await getResponse('/payment-hold-frns')
      return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, paymentHoldFRNs: paymentHoldFRNsResponse.payload.paymentHoldFrns })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      await postRequest('/add-payment-hold', { holdCategoryId: request.payload.holdCategory, frn: request.payload.frn }, null)
      return h.redirect('/')
    }
  }
}]
