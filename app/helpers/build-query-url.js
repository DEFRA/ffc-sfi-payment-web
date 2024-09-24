const buildQueryUrl = (path, schemeId, year, prn, frn, revenueOrCapital) => {
  let url = `${path}?schemeId=${schemeId}&year=${year}`
  if (prn) {
    url += `&prn=${prn}`
  }
  if (frn) {
    url += `&frn=${frn}`
  }
  if (revenueOrCapital && revenueOrCapital.trim() !== '') {
    url += `&revenueOrCapital=${revenueOrCapital}`
  }
  return url
}

module.exports = {
  buildQueryUrl
}
