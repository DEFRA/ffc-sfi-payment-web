const config = require('../config')
const msal = require('@azure/msal-node')
const getPermissions = require('./get-permissions')

const msalLogging = config.isProd
  ? {}
  : {
      loggerCallback (loglevel, message, containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose
    }

const msalClientApplication = new msal.ConfidentialClientApplication({
  auth: config.authConfig.azure,
  system: { loggerOptions: msalLogging }
})

const getAuthenticationUrl = () => {
  const authCodeUrlParameters = {
    prompt: 'select_account', // Force the MS account select dialog
    redirectUri: config.authConfig.redirectUrl
  }

  return msalClientApplication.getAuthCodeUrl(authCodeUrlParameters)
}

const authenticate = async (redirectCode, cookieAuth) => {
  const token = await msalClientApplication.acquireTokenByCode({
    code: redirectCode,
    redirectUri: config.authConfig.redirectUrl
  })

  cookieAuth.set({
    permissions: getPermissions(token.idTokenClaims.roles),
    account: token.account
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  const token = await msalClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })

  const perms = getPermissions(token.idTokenClaims.roles)
  cookieAuth.set({
    permissions: perms,
    account: token.account
  })

  return perms
}

const logout = (account) => {
  msalClientApplication.getTokenCache().removeAccount(account)
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
