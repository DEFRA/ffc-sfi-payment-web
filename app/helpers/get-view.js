const { getSchemes } = require('./get-schemes')

const getView = async (path, h) => {
  const schemes = await getSchemes()
  return h.view(path, { schemes })
}

module.exports = {
  getView
}
