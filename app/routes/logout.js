const azureAuth = require('../azure-auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: (request, h) => {
    request.cookieAuth.clear()
    azureAuth.logout(request.auth.credentials.account)
    return h.redirect('/login')
  }
}
