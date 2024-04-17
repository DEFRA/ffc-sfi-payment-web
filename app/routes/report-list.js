const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const { getReportTypes } = require('../constants/report-types')

module.exports = {
  method: 'GET',
  path: '/report-list',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin, dataView] },
    handler: async (_request, h) => {
      const reportTypes = getReportTypes()
      const reportTypesKeys = Object.keys(reportTypes)

      return h.view('report-list', {
        reportTypes: reportTypesKeys,
        reportTypesRoutes: reportTypes,
        totalReportTypes: reportTypesKeys.length
      })
    }
  }
}