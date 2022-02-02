const permissions = {
  viewPaymentHolds: 'Payments.View.Holds',
  viewPaymentScheme: 'Payments.View.Scheme',
  addPaymentHold: 'Payments.Add.Hold',
  removePaymentHold: 'Payments.Remove.Hold'
}

const hasRole = (role, roles) => {
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
