const permissions = {
  viewPayments: 'Payments.View',
  approvePayments: 'Payments.Approve',
  deletePayments: 'Payments.Delete'
}

function hasRole (role, roles) {
  return roles?.includes(role) ?? false
}

function getPermissions (roles) {
  return Object.entries(permissions).reduce((acc, [k, v]) => {
    acc[k] = hasRole(v, roles)
    acc.summary += acc[k] ? `${v} | ` : ''
    return acc
  }, { summary: '| ' })
}

module.exports = getPermissions
