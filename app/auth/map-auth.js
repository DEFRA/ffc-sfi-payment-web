const isInRole = require('./is-in-role')
const { schemeAdmin, holdAdmin, dataView } = require('./permissions')

const mapAuth = (request) => {
  return {
    isAuthenticated: request.auth.isAuthenticated,
    isAnonymous: !request.auth.isAuthenticated,
    isSchemeAdminUser: request.auth.isAuthenticated && isInRole(request.auth.credentials, schemeAdmin),
    isHoldAdminUser: request.auth.isAuthenticated && isInRole(request.auth.credentials, holdAdmin),
    isDataViewUser: request.auth.isAuthenticated && isInRole(request.auth.credentials, dataView)
  }
}

module.exports = mapAuth
