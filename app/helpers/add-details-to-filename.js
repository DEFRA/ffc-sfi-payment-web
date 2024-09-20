const addDetailsToFilename = (reportName, schemeId, year, prn, revenueOrCapital, frn) => {
  if (!reportName.endsWith('.csv')) {
    throw new Error('An internal configuration error occurred - filename is not in expected format')
  }

  const csvIndex = reportName.lastIndexOf('.csv')

  const baseName = reportName.slice(0, csvIndex)

  let newReportName = `${baseName}_schemeId_${schemeId}_year_${year}`

  if (prn) {
    newReportName += `_prn_${prn}`
  }

  if (revenueOrCapital) {
    newReportName += `_revenueOrCapital_${revenueOrCapital}`
  }

  if (frn) {
    newReportName += `_frn_${frn}`
  }

  return (newReportName + '.csv')
}

module.exports = {
  addDetailsToFilename
}
