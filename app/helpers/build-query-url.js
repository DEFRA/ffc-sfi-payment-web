const buildQueryUrl = (path, schemeId, year, frn, revenueOrCapital) => {
  let url = `${path}?schemeId=${schemeId}&year=${year}`
  if (frn && frn.trim() !== '') {
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
