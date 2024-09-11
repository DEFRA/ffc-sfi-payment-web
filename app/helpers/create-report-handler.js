const { buildQueryUrl } = require('./build-query-url')
const { fetchDataAndRespond } = require('./fetch-data-and-respond')
const api = require('../api')
const { mapReportData } = require('./map-report-data')

const createReportHandler = (path, fields, filenameFunc, errorView) => {
  return async (request, h) => {
    const { schemeId, year, revenueOrCapital, frn } = request.query
    const url = buildQueryUrl(path, schemeId, year, frn, revenueOrCapital)
    return fetchDataAndRespond(
      () => api.getTrackingData(url),
      (response) => response.payload[Object.keys(response.payload)[0]].map(data => mapReportData(data, fields)),
      filenameFunc(schemeId, year, revenueOrCapital, frn),
      h,
      errorView
    )
  }
}

module.exports = {
  createReportHandler
}
