const { holdAdmin, schemeAdmin, dataView } = require('../auth/permissions')
const api = require('../api')
const convertToCSV = require('../convert-to-csv')
const apListingSchema = require('../routes/schemas/ap-listing-schema')

module.exports = [
  {
    method: 'GET',
    path: '/report-list/ap-listing',
    options: {
      auth: { scope: [holdAdmin, schemeAdmin, dataView] },
      handler: async (request, h) => {
        return h.view('ap-listing-report')
      }
    }
  },
  {
    method: 'GET',
    path: '/report-list/ap-listing/download',
    options: {
      auth: { scope: [holdAdmin, schemeAdmin, dataView] },
      validate: {
      query: apListingSchema,
      failAction: async (request, h, err) => {
        request.log(['error', 'validation'], err)
        const data = {
          errorMessage: err.details[0].message
        }
        return h.view('ap-listing-report', data).takeover()
      }
    },
      handler: async (request, h) => {
        const { 'start-date-day': startDay, 'start-date-month': startMonth, 'start-date-year': startYear, 'end-date-day': endDay, 'end-date-month': endMonth, 'end-date-year': endYear } = request.query

        let url = '/ap-report-data'
        let startDate, endDate

        if (startDay && startMonth && startYear) {
          startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`
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

          const dataWithoutReportDataId = trackingData.apReportData.map(({ reportDataId, ...rest }) => rest)

          const csv = convertToCSV(dataWithoutReportDataId)

          const filename = `APListingReportData-from-${startDate || 'beginning'}-to-${endDate || 'now'}.csv`
          const headers = {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=${filename}`
          }
          return h.response(csv)
            .header('Content-Type', 'text/csv')
            .header('Content-Disposition', `attachment; filename=${filename}`)
        } catch (error) {
          console.error('Failed to fetch tracking data:', error)
          return h.view('ap-listing-report', { errorMessage: 'Failed to fetch tracking data' })
        }
      }
    }
  }
]