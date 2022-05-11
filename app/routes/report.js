const { getMIReport } = require('../storage')
const { holdAdmin, schemeAdmin } = require('../auth/permissions')
const config = require('../config/storage')

module.exports = {
  method: 'GET',
  path: '/report',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] },
    handler: async (_request, h) => {
      try {
        const response = await getMIReport()
        if (response) {
          return h.response(response.readableStreamBody)
            .type('text/csv')
            .header('Connection', 'keep-alive')
            .header('Cache-Control', 'no-cache')
            .header('Content-Disposition', `attachment;filename=${config.miReportName}`)
        }
      } catch {
        return h.view('report-unavailable')
      }
    }
  }
}
