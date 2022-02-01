const azureAuth = require('../azure-auth')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    options: {
      auth: false
    },
    handler: (request, h) => {
      return h.view('login')
    }
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      auth: { mode: 'try' }
    },
    handler: async (request, h) => {
      try {
        const authUrl = await azureAuth.getAuthenticationUrl()
        return h.redirect(authUrl)
      } catch (err) {
        console.log('Error authenticating')
        console.log(JSON.stringify(err))
      }

      return h.view('500').code(500)
    }
  }
]
