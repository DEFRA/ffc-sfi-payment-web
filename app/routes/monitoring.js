const { schemeAdmin, holdAdmin } = require('../auth/permissions')
const config = require('../config')
const { getPaymentsByFrn } = require('../payments')
const ViewModel = require('./models/monitoring')

module.exports = [{
  method: 'GET',
  path: '/monitoring',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.redirect('/event-projection')
    }
    return h.view('monitoring', new ViewModel())
  }
}, {
  method: 'GET',
  path: '/monitoring/payments',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.view('404')
    }
    const frn = request.query.frn
    const payments = getPaymentsByFrn(frn)
    return h.view('monitoring-frn', { frn, payments })
  }
}]
