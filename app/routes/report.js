const { getMIReport, getSuppressedReport } = require('../storage')
const api = require('../api')
const { getHolds } = require('../holds')
const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const formatDate = require('../helpers/format-date')
const storageConfig = require('../config/storage')
const schema = require('./schemas/report-schema')
const { addDetailsToFilename, getSchemes, handleCSVResponse, buildQueryUrl, renderErrorPage } = require('../helpers')

module.exports = [{
  method: 'GET',
  path: '/report-list/payment-requests',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
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
      const schemes = await getSchemes()
      return h.view('reports-list/transaction-summary', { schemes })
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
    handler: async (request, h) => {
      try {
        const { schemeId, year, revenueOrCapital, frn } = request.query
        const url = buildQueryUrl('/transaction-summary', schemeId, year, frn, revenueOrCapital)
        const response = await api.getTrackingData(url)
        const trackingData = response.payload
        const selectedData = trackingData.reportData.map(data => {
          return {
            ID: data.correlationId,
            FRN: data.frn,
            ClaimID: data.claimNumber,
            AgreementNumber: data.agreementNumber,
            RevenueOrCapital: data.revenueOrCapital,
            Year: data.year,
            InvoiceNumber: data.invoiceNumber,
            PaymentCurrency: data.currency,
            PaymentRequestNumber: data.paymentRequestNumber,
            FullClaimAmount: data.value,
            BatchID: data.batch,
            BatchCreatorID: data.sourceSystem,
            BatchExportDate: data.batchExportDate,
            RoutedToRequestEditor: data.routedToRequestEditor,
            DeltaAmount: data.deltaAmount,
            APAmount: data.apValue,
            ARAmount: data.arValue,
            AdminOrIrregular: data.debtType,
            Status: data.status,
            LastUpdated: data.lastUpdated
          }
        })

        if (selectedData.length === 0) {
          return h.view('reports-list/transaction-summary', {
            errors: [{
              text: 'No data available for the selected filters'
            }]
          })
        }
        const filename = addDetailsToFilename(storageConfig.summaryReportName, schemeId, year, revenueOrCapital, frn)
        return handleCSVResponse(selectedData, filename)(h)
      } catch {
        return h.view('payment-report-unavailable')
      }
    }
  }
}, {
  method: 'GET',
  path: '/report-list/request-editor-report',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    handler: async (request, h) => {
      try {
        const response = await api.getTrackingData('/request-editor-report')
        const trackingData = response.payload
        const selectedData = trackingData.reReportData.map(data => {
          return {
            FRN: data.frn,
            DeltaAmount: data.deltaAmount,
            SourceSystem: data.sourceSystem,
            ClaimID: data.claimNumber,
            InvoiceNumber: data.invoiceNumber,
            PaymentRequestNumber: data.paymentRequestNumber,
            Year: data.year,
            ReceivedInRequestEditor: data.receivedInRequestEditor,
            Enriched: data.enriched,
            DebtType: data.debtType,
            LedgerSplit: data.ledgerSplit,
            ReleasedFromRequestEditor: data.releasedFromRequestEditor
          }
        })

        if (selectedData.length === 0) {
          return h.view('payment-report-unavailable')
        }

        return handleCSVResponse(selectedData, storageConfig.requestEditorReportName)(h)
      } catch {
        return h.view('payment-report-unavailable')
      }
    }
  }
}, {
  method: 'GET',
  path: '/report-list/claim-level-report',
  options: {
    auth: { scope: [holdAdmin, schemeAdmin, dataView] },
    handler: async (request, h) => {
      const schemes = await getSchemes()
      return h.view('reports-list/claim-level-report', { schemes })
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
    handler: async (request, h) => {
      try {
        const { schemeId, year, revenueOrCapital, frn } = request.query
        const url = buildQueryUrl('/transaction-summary', schemeId, year, frn, revenueOrCapital)
        const response = await api.getTrackingData(url)
        const trackingData = response.payload
        const selectedData = trackingData.claimLevelReportData.map(data => {
          return {
            FRN: data.frn,
            ClaimID: data.claimNumber,
            RevenueOrCapital: data.revenueOrCapital,
            AgreementNumber: data.agreementNumber,
            Year: data.year,
            PaymentCurrency: data.currency,
            LatestFullClaimAmount: data.value,
            LatestSitiPR: data.paymentRequestNumber,
            LatestInDAXAmount: data.daxValue,
            LatestInDAXPR: data.daxPaymentRequestNumber,
            OverallStatus: data.overallStatus,
            CrossBorderFlag: data.crossBorderFlag,
            LatestTransactionStatus: data.status,
            ValueStillToProcess: data.valueStillToProcess,
            PRsStillToProcess: data.prStillToProcess
          }
        })

        if (selectedData.length === 0) {
          return h.view('reports-list/claim-level-report', {
            errors: [{
              text: 'No data available for the selected filters'
            }]
          })
        }

        const filename = addDetailsToFilename(storageConfig.claimLevelReportName, schemeId, year, revenueOrCapital, frn)
        return handleCSVResponse(selectedData, filename)(h)
      } catch {
        return h.view('payment-report-unavailable')
      }
    }
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
          return h.response(response.readableStreamBody)
            .type('text/csv')
            .header('Connection', 'keep-alive')
            .header('Cache-Control', 'no-cache')
            .header('Content-Disposition', `attachment;filename=${storageConfig.suppressedReportName}`)
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
        const paymentHolds = await getHolds()
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
