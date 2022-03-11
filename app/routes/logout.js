const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: (request, h) => {
    request?.auth?.credentials?.account && auth.logout(request.auth.credentials.account)
    request?.cookieAuth && request.cookieAuth.clear()
    return h.redirect('/login')
  }
}
