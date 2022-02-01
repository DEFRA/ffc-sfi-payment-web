const azureAuth = require('../azure-auth')

module.exports = {
  method: 'GET',
  path: '/authenticate',
  options: {
    auth: { mode: 'try' }
  },
  handler: async (request, h) => {
    try {
      await azureAuth.authenticate(request.query.code, request.cookieAuth)
      return h.redirect('/')
    } catch (err) {
      console.log('Error authenticating')
      console.log(JSON.stringify(err))
    }

    return h.view('500').code(500)
  }
}
