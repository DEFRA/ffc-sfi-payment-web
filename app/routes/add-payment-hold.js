const { getPaymentHoldCategoriesResponse, getPaymentHoldFRNsResponse } = require('../payment-holds')

module.exports = [{
  method: 'GET',
  path: '/payment-holds/add',
  options: {
    handler: async (request, h) => {
      const paymentHoldCategoriesResponse = await getPaymentHoldCategoriesResponse('/get-payment-hold-categories')
      const paymentHoldFRNsResponse = await getPaymentHoldFRNsResponse('/get-payment-hold-frns')
      return h.view('add-payment-hold', { paymentHoldCategories: paymentHoldCategoriesResponse.payload, paymentHoldFRNs: paymentHoldFRNsResponse.payload })
    }
  }
},
{
  method: 'POST',
  path: '/payment-holds/add',
  options: {
    handler: async (request, h) => {
      // const paymentHoldResponse = await getPaymentHoldResponse('/payment-holds')
      // return h.view('payment-holds', { paymentHolds: paymentHoldResponse.payload })
    }
  }
}]
