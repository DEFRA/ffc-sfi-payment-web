const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/report-list',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin, dataView] },
    handler: async (_request, h) => {
      return h.view('report-list')
    }
  }
}
