const { get } = require('../api')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      const username = request.auth.credentials.account.username
      const permissions = request.auth.credentials.permissions
      const paymentHoldsResponse = await get('/payment-holds')
      const schemes = await get('/payment-schemes')
      return h.view('home', {
        username,
        permissions,
        totalHolds: paymentHoldsResponse.payload.paymentHolds?.filter(x => x.dateTimeClosed == null).length ?? 0,
        totalSchemes: schemes.payload.paymentSchemes?.length ?? 0
      })
    }
  }
}
