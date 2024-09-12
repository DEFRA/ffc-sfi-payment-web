const mapReportData = (data, fields) => {
  const mappedData = {}
  for (const [key, path] of Object.entries(fields)) {
    mappedData[key] = path.split('.').reduce((obj, p) => obj?.[p], data)
  }
  return mappedData
}

module.exports = {
  mapReportData
}
