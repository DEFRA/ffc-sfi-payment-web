const config = require('../config')
const msal = require('@azure/msal-node')
const permissions = require('../permissions')

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

function getAuthenticationUrl () {
  const authCodeUrlParameters = {
    prompt: 'select_account', // Force the MS account select dialog
    redirectUri: config.authConfig.redirectUrl
  }

  return msalClientApplication.getAuthCodeUrl(authCodeUrlParameters)
}

async function authenticate (redirectCode, cookieAuth) {
  const token = await msalClientApplication.acquireTokenByCode({
    code: redirectCode,
    redirectUri: config.authConfig.redirectUrl
  })

  cookieAuth.set({
    permissions: permissions(token.idTokenClaims.roles),
    account: token.account
  })
}

async function refresh (account, cookieAuth, forceRefresh = true) {
  const token = await msalClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })

  const perms = permissions(token.idTokenClaims.roles)
  cookieAuth.set({
    permissions: perms,
    account: token.account
  })

  return perms
}

function logout (account) {
  msalClientApplication.getTokenCache().removeAccount(account)
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
