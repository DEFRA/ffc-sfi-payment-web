const { getMIReport, getSuppressedReport } = require('../storage')
const api = require('../api')
const { getHolds } = require('../holds')
const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const formatDate = require('../helpers/format-date')
const storageConfig = require('../config/storage')
const schema = require('./schemas/report-schema')
const { addDetailsToFilename, handleCSVResponse, buildQueryUrl, renderErrorPage, fetchDataAndRespond, readableStreamReturn, getView, mapReportData } = require('../helpers')
const transactionSummaryFields = require('../constants/transaction-summary-fields')
const claimLevelReportFields = require('../constants/claim-level-report-fields')
const requestEditorReportFields = require('../constants/request-editor-report-fields')

const getTransactionSummaryHandler = async (request, h) => {
  const { schemeId, year, revenueOrCapital, frn } = request.query
  const url = buildQueryUrl('/transaction-summary', schemeId, year, frn, revenueOrCapital)
  return fetchDataAndRespond(
    () => api.getTrackingData(url),
    (response) => response.payload.reportData.map(data => mapReportData(data, transactionSummaryFields)),
    addDetailsToFilename(storageConfig.claimLevelReportName, schemeId, year, revenueOrCapital, frn),
    h,
    'reports-list/transaction-summary'
  )
}

const getClaimLevelReportHandler = async (request, h) => {
  const { schemeId, year, revenueOrCapital, frn } = request.query
  const url = buildQueryUrl('/claim-level-report', schemeId, year, frn, revenueOrCapital)
  return fetchDataAndRespond(
    () => api.getTrackingData(url),
    (response) => response.payload.claimLevelReportData.map(data => mapReportData(data, claimLevelReportFields)),
    addDetailsToFilename(storageConfig.summaryReportName, schemeId, year, revenueOrCapital, frn),
    h,
    'reports-list/claim-level-report'
  )
}

const getRequestEditorReportHandler = async (request, h) => {
  return fetchDataAndRespond(
    () => api.getTrackingData('/request-editor-report'),
    (response) => response.payload.reReportData.map(data => mapReportData(data, requestEditorReportFields)),
    storageConfig.requestEditorReportName,
    h,
    'payment-report-unavailable'
  )
}

module.exports = [{
  method: 'GET',
  path: '/report-list/payment-requests',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: async (_request, h) => {
      try {
        const response = await getMIReport()
        if (response) {
          return readableStreamReturn(response, h, storageConfig.miReportName)
        }
      } catch {
        return h.view('payment-report-unavailable')
      }
    }
  }
}, {
  method: 'GET',
  path: '/report-list/transaction-summary',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin, dataView] },
    handler: async (request, h) => {
      return getView('reports-list/transaction-summary', h)
    }
  }
}, {
  method: 'GET',
  path: '/report-list/transaction-summary/download',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    validate: {
      query: schema,
      failAction: async (request, h, err) => {
        return renderErrorPage('reports-list/transaction-summary', request, h, err)
      }
    },
    handler: getTransactionSummaryHandler
  }
}, {
  method: 'GET',
  path: '/report-list/request-editor-report',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: getRequestEditorReportHandler
  }
}, {
  method: 'GET',
  path: '/report-list/claim-level-report',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin, dataView] },
    handler: async (request, h) => {
      return getView('reports-list/claim-level-report', h)
    }
  }
}, {
  method: 'GET',
  path: '/report-list/claim-level-report/download',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    validate: {
      query: schema,
      failAction: async (request, h, err) => {
        return renderErrorPage('reports-list/claim-level-report', request, h, err)
      }
    },
    handler: getClaimLevelReportHandler
  }
},
{
  method: 'GET',
  path: '/report-list/suppressed-payments',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: async (_request, h) => {
      try {
        const response = await getSuppressedReport()
        if (response) {
          return readableStreamReturn(response, h, storageConfig.suppressedReportName)
        }
      } catch {
        return h.view('payment-report-unavailable')
      }
    }
  }
},
{
  method: 'GET',
  path: '/report-list/holds',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: async (request, h) => {
      try {
        const paymentHolds = await getHolds(undefined, undefined, false)
        if (paymentHolds) {
          const paymentHoldsData = paymentHolds.map(hold => {
            return {
              frn: hold.frn,
              scheme: hold.holdCategorySchemeName,
              marketingYear: hold.marketingYear ?? 'All',
              holdCategory: hold.holdCategoryName,
              dateAdded: formatDate(hold.dateTimeAdded)
            }
          })
          return handleCSVResponse(paymentHoldsData, storageConfig.holdReportName)(h)
        }
        return h.view('hold-report-unavailable')
      } catch {
        return h.view('hold-report-unavailable')
      }
    }
  }
}]
