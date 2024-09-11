const { getSchemes } = require('./get-schemes')
const { handleCSVResponse } = require('./handle-csv-response')

const fetchDataAndRespond = async (fetchFn, transformFn, filename, h, emptyView) => {
  try {
    const response = await fetchFn()
    const data = transformFn(response)
    if (data.length === 0) {
      const schemes = await getSchemes()
      return h.view(emptyView, { schemes, errors: [{ text: 'No data available for the selected filters' }] })
    }
    return handleCSVResponse(data, filename)(h)
  } catch {
    return h.view('payment-report-unavailable')
  }
}

module.exports = {
  fetchDataAndRespond
}
