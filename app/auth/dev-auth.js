const { ledger, enrichment } = require('./permissions')
const { v4: uuidv4 } = require('uuid')
const devAccount = { homeAccountId: uuidv4(), name: 'Developer' }

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const authenticate = async (redirectCode, cookieAuth) => {
  cookieAuth.set({
    scope: [ledger, enrichment],
    account: devAccount
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  cookieAuth.set({
    scope: [ledger, enrichment],
    account: devAccount
  })

  return [ledger, enrichment]
}

const logout = async (account) => {
  devAccount.homeAccountId = uuidv4()
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
