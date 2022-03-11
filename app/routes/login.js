const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/login',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    try {
      const authUrl = await auth.getAuthenticationUrl()
      return h.redirect(authUrl)
    } catch (err) {
      console.log('Error authenticating')
      console.log(JSON.stringify(err))
    }
    return h.view('500').code(500)
  }
}
