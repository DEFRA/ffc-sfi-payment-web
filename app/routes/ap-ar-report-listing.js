const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const api = require('../api')
const convertToCSV = require('../convert-to-csv')
const apListingSchema = require('./schemas/ap-listing-schema')
const config = require('../config/storage')

function generateRoutes (reportName, reportDataUrl, reportDataKey) {
  return [
    {
      method: 'GET',
      path: `/report-list/${reportName}`,
      options: {
        auth: { scope: [holdAdmin, schemeAdmin, dataView] },
        handler: async (request, h) => {
          return h.view(`reports-list/${reportName}`)
        }
      }
    },
    {
      method: 'GET',
      path: `/report-list/${reportName}/download`,
      options: {
        auth: { scope: [holdAdmin, schemeAdmin, dataView] },
        validate: {
          query: apListingSchema,
          failAction: async (request, h, err) => {
            request.log(['error', 'validation'], err)
            const errors = err.details
              ? err.details.map(detail => {
                  return {
                    text: detail.message,
                    href: '#' + detail.path[0]
                  }
                })
              : []
            const data = { errors }
            return h.view(`reports-list/${reportName}`, data).code(400).takeover()
          }
        },
        handler: async (request, h) => {
          const { 'start-date-day': startDay, 'start-date-month': startMonth, 'start-date-year': startYear, 'end-date-day': endDay, 'end-date-month': endMonth, 'end-date-year': endYear } = request.query

          let url = reportDataUrl
          let startDate, endDate

          if (startDay && startMonth && startYear) {
            startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`
          } else {
            startDate = '2015-01-01'
          }

          if (endDay && endMonth && endYear) {
            endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`
          } else if (startDate) {
            const now = new Date()
            endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
          }

          if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`
          }

          try {
            const response = await api.getTrackingData(url)
            const trackingData = response.payload

            const selectedData = trackingData[reportDataKey].map(data => {
              const mappedData = {
                Filename: data.batch,
                'Date Time': data.lastUpdated,
                Event: data.status,
                FRN: data.frn,
                'Original Invoice Number': data.originalInvoiceNumber,
                'Original Invoice Value': data.value,
                'Invoice Number': data.invoiceNumber,
                'Invoice Delta Amount': data.deltaAmount,
                'D365 Invoice Imported': data.routedToRequestEditor,
                'D365 Invoice Payment': data.settledValue,
                'PH Error Status': data.phError,
                'D365 Error Status': data.daxError
              }
              if (reportName === 'ar-listing') {
                delete mappedData['D365 Invoice Payment']
              }
              return mappedData
            })

            if (selectedData.length === 0) {
              return h.view(`reports-list/${reportName}`, {
                errors: [{
                  text: 'No data available for the selected date range'
                }]
              })
            }

            const csv = convertToCSV(selectedData)

            const baseFilename = reportName === 'ar-listing' ? config.arListingReportName.slice(0, -4) : config.apListingReportName.slice(0, -4)
            const filename = `${baseFilename}-from-${startDate}-to-${endDate}.csv`
            return h.response(csv)
              .header('Content-Type', 'text/csv')
              .header('Content-Disposition', `attachment; filename=${filename}`)
          } catch (error) {
            console.error('Failed to fetch tracking data:', error)
            return h.view(`reports-list/${reportName}`, { errorMessage: 'Failed to fetch tracking data' })
          }
        }
      }
    }
  ]
}

module.exports = generateRoutes
