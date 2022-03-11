const permissions = require('./permissions')
const config = require('../config').authConfig

const hasRole = (role, roles) => {
  if (!config.enabled) {
    return true
  }
  return roles?.includes(role) ?? false
}

const getPermissions = (roles) => {
  return Object.entries(permissions).reduce((acc, [k, v]) => {
    acc[k] = hasRole(v, roles)
    acc.summary += acc[k] ? `${v} | ` : ''
    return acc
  }, { summary: '| ' })
}

module.exports = getPermissions
