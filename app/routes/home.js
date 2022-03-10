const { get } = require('../api')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      const paymentHoldsResponse = await get('/payment-holds')
      const schemes = await get('/payment-schemes')
      return h.view('home', {
        totalHolds: paymentHoldsResponse.payload.paymentHolds?.length ?? 0,
        totalSchemes: schemes.payload.paymentSchemes?.length ?? 0
      })
    }
  }
}
