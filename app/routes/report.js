const { getMIReport, getSuppressedReport } = require('../storage')
const { getHolds } = require('../holds')
const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const formatDate = require('../helpers/format-date')
const storageConfig = require('../config/storage')
const schema = require('./schemas/report-schema')
const { addDetailsToFilename, createReportHandler, handleCSVResponse, renderErrorPage, getView, handleStreamResponse } = require('../helpers')
const transactionSummaryFields = require('../constants/transaction-summary-fields')
const claimLevelReportFields = require('../constants/claim-level-report-fields')
const requestEditorReportFields = require('../constants/request-editor-report-fields')

const getTransactionSummaryHandler = createReportHandler(
  '/transaction-summary',
  transactionSummaryFields,
  (schemeId, year, revenueOrCapital, frn) => addDetailsToFilename(storageConfig.claimLevelReportName, schemeId, year, revenueOrCapital, frn),
  'reports-list/transaction-summary'
)

const getClaimLevelReportHandler = createReportHandler(
  '/claim-level-report',
  claimLevelReportFields,
  (schemeId, year, revenueOrCapital, frn) => addDetailsToFilename(storageConfig.summaryReportName, schemeId, year, revenueOrCapital, frn),
  'reports-list/claim-level-report'
)

const getRequestEditorReportHandler = createReportHandler(
  '/request-editor-report',
  requestEditorReportFields,
  () => storageConfig.requestEditorReportName,
  'payment-report-unavailable'
)

module.exports = [{
  method: 'GET',
  path: '/report-list/payment-requests',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: async (_request, h) => handleStreamResponse(getMIReport, storageConfig.miReportName, h)
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
    handler: async (_request, h) => handleStreamResponse(getSuppressedReport, storageConfig.suppressedReportName, h)
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
      } catch {
        return h.view('hold-report-unavailable')
      }
    }
  }
}]
