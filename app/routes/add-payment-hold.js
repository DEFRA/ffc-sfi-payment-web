const { getPaymentHoldCategoriesResponse, getPaymentHoldFRNsResponse, addPaymentHoldRequest } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategoriesResponse = await getPaymentHoldCategoriesResponse('/payment-hold-categories')
      const paymentHoldFRNsResponse = await getPaymentHoldFRNsResponse('/payment-hold-frns')
      return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload.paymentHoldCategories, paymentHoldFRNs: paymentHoldFRNsResponse.payload.paymentHoldFrns })
    }
  }
},
{
  method: 'POST',
  path: '/add-payment-hold',
  options: {
    handler: async (request, h) => {
      await addPaymentHoldRequest('/add-payment-hold', { holdCategoryId: request.payload.holdCategory, frn: request.payload.frn }, null)
      return h.redirect('/')
    }
  }
}]
