const { schemeAdmin, holdAdmin } = require('../auth/permissions')
const { getPaymentsBySchemeId } = require('../payments')

module.exports = [{
  method: 'GET',
  path: '/monitoring/view-processed-payment-requests',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    const processedPaymentRequests = await getPaymentsBySchemeId()
    console.log(processedPaymentRequests)
    return processedPaymentRequests
  }
}]
