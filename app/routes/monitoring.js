const config = require('../config')
const { schemeAdmin, holdAdmin, dataView } = require('../auth/permissions')
const { getPaymentsByFrn, getPaymentsByCorrelationId } = require('../payments')
const ViewModel = require('./models/monitoring')

module.exports = [{
  method: 'GET',
  path: '/monitoring',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.redirect('/event-projection')
    }
    return h.view('monitoring/monitoring', new ViewModel())
  }
}, {
  method: 'GET',
  path: '/monitoring/payments/frn',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const frn = request.query.frn
    const payments = await getPaymentsByFrn(frn)
    return h.view('monitoring/frn', { frn, payments })
  }
}, {
  method: 'GET',
  path: '/monitoring/payments/correlation-id',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const correlationId = request.query.correlationId
    const events = await getPaymentsByCorrelationId(correlationId)
    return h.view('monitoring/correlation-id', { correlationId, events })
  }
}]
