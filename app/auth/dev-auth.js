const { holdAdmin, schemeAdmin, dataView, closureAdmin } = require('./permissions')
const { v4: uuidv4 } = require('uuid')
const devAccount = require('./dev-account')

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const authenticate = async (_redirectCode, cookieAuth) => {
  cookieAuth.set({
    scope: [holdAdmin, schemeAdmin, dataView, closureAdmin],
    account: devAccount
  })
}

const refresh = async (_account, cookieAuth, _forceRefresh = true) => {
  cookieAuth.set({
    scope: [holdAdmin, schemeAdmin, dataView, closureAdmin],
    account: devAccount
  })

  return [holdAdmin, schemeAdmin, dataView, closureAdmin]
}

const logout = async (_account) => {
  devAccount.homeAccountId = uuidv4()
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
