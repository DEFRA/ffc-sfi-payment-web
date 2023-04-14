const { SOURCE } = require('../constants/source')

const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: SOURCE,
    ...options
  }
}

module.exports = {
  createMessage
}
