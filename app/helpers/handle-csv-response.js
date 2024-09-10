const convertToCSV = require('./convert-to-csv')

const handleCSVResponse = (data, filename) => h => {
  const csv = convertToCSV(data)
  return h.response(csv)
    .header('Content-Type', 'text/csv')
    .header('Content-Disposition', `attachment; filename=${filename}`)
}

module.exports = {
  handleCSVResponse
}
