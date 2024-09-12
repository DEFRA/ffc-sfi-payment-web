const { getSchemes } = require('./get-schemes')

const renderErrorPage = async (view, request, h, err) => {
  request.log(['error', 'validation'], err)
  const errors = err.details
    ? err.details.map(detail => {
        return {
          text: detail.message,
          href: '#' + detail.path[0]
        }
      })
    : []
  const schemes = await getSchemes()
  return h.view(view, { schemes, errors }).code(400).takeover()
}

module.exports = {
  renderErrorPage
}
