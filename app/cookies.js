const { cookieNames: { cookiesPolicy: cookiesPolicyCookieName }, cookieOptions } = require('./config')

const getCurrentPolicy = (request, h) => {
  let cookiesPolicy = request.state[cookiesPolicyCookieName]
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state(cookiesPolicyCookieName, cookiesPolicy, cookieOptions)
  return cookiesPolicy
}

const updatePolicy = (request, h, analytics) => {
  let cookiesPolicy = request.state[cookiesPolicyCookieName]
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state(cookiesPolicyCookieName, cookiesPolicy, cookieOptions)
}

module.exports = {
  getCurrentPolicy,
  updatePolicy
}
