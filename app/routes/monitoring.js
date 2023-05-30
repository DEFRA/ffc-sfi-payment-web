const config = require('../config')
const { schemeAdmin, holdAdmin } = require('../auth/permissions')
const { getPaymentsByFrn, getPaymentsByCorrelationId, getPaymentsByBatch } = require('../payments')
const ViewModel = require('./models/monitoring')

module.exports = [{
  method: 'GET',
  path: '/monitoring',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    return h.view('monitoring/monitoring', new ViewModel())
  }
}, {
  method: 'GET',
  path: '/monitoring/payments/frn',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
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
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const correlationId = request.query.correlationId
    const events = await getPaymentsByCorrelationId(correlationId)
    return h.view('monitoring/correlation-id', { correlationId, events })
  }
}, {
  method: 'GET',
  path: '/monitoring/batch/name',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404').code(404)
    }
    const batch = request.query.batch
    const payments = await getPaymentsByBatch(batch)
    return h.view('monitoring/batch', { batch, payments })
  }
}]
