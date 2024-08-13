const config = require('../config')
const { schemeAdmin, holdAdmin, dataView } = require('../auth/permissions')
const { getPaymentsByScheme } = require('../payments')
const { get } = require('../api')

module.exports = [{
  method: 'GET',
  path: '/monitoring/schemes',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const schemes = await get('/payment-schemes')
    return h.view('monitoring/schemes', { data: schemes?.payload?.paymentSchemes })
  }
}, {
  method: 'GET',
  path: '/monitoring/view-processed-payment-requests',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const { schemeId } = request.query
    try {
      const processedPaymentRequests = await getPaymentsByScheme(schemeId)
      return h.view('monitoring/view-processed-payment-requests', { data: processedPaymentRequests })
    } catch (err) {
      return h.view('monitoring/schemes', { error: err.data?.payload?.message ?? err.message, schemeId }).code(412)
    }
  }
}]
