const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-pay-web',
    ...options
  }
}

module.exports = createMessage
