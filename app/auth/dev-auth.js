const getPermissions = require('./get-permissions')

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const authenticate = async (redirectCode, cookieAuth) => {
  cookieAuth.set({
    permissions: getPermissions(),
    account: 'Developer'
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  const permissions = getPermissions()
  cookieAuth.set({
    permissions: getPermissions(),
    account: 'Developer'
  })

  return permissions
}

const logout = (account) => { return undefined }

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
