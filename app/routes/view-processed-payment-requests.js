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
    return h.view('monitoring/view-processed-payment-requests', { data: processedPaymentRequests })
  }
}]
