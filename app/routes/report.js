const { getMIReport } = require('../storage')
const { getHolds } = require('../holds')
const { holdAdmin, schemeAdmin } = require('../auth/permissions')
const formatDate = require('../format-date')
const convertToCsv = require('../convert-to-csv')
const storageConfig = require('../config/storage')
const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/report/payment-requests',
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
            .header('Content-Disposition', `attachment;filename=${storageConfig.miReportName}`)
        }
      } catch {
        return h.view('report-unavailable')
      }
    }
  }
},
{
  method: 'GET',
  path: '/report/holds',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] },
    handler: async (_request, h) => {
      try {
        const paymentHolds = await getHolds()
        const paymentHoldsData = paymentHolds.map(hold => {
          return {
            frn: hold.frn,
            scheme: hold.holdCategorySchemeName,
            holdCategory: hold.holdCategoryName,
            dateAdded: formatDate(hold.dateTimeAdded)
          }
        })
        const response = convertToCsv(paymentHoldsData)
        if (response) {
          return h.response(response)
            .type('text/csv')
            .header('Connection', 'keep-alive')
            .header('Cache-Control', 'no-cache')
            .header('Content-Disposition', `attachment;filename=${config.holdReportName}`)
        }
      } catch (ex) {
        console.log(ex)
        return h.view('report-unavailable')
      }
    }
  }
}]
