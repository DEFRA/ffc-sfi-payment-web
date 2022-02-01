module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: (request, h) => {
      const username = request.auth.credentials.account.username
      const permissions = request.auth.credentials.permissions
      return h.view('home', { username, permissions })
    }
  }
}
