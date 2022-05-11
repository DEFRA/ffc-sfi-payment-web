const { mapAuth, getUser } = require('../auth')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.context) {
          request.response.source.context.auth = mapAuth(request)
          request.response.source.context.user = getUser(request)
        }
        return h.continue
      })
    }
  }
}
