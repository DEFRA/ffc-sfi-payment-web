const joi = require('joi')
const { updatePolicy } = require('../cookies')
const { cookieNames: { cookiesPolicy } } = require('../config')
const ViewModel = require('./models/cookies-policy')

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', new ViewModel(request.state[cookiesPolicy], request.query.updated))
  }
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    plugins: {
      crumb: false
    },
    validate: {
      payload: joi.object({
        analytics: joi.boolean(),
        async: joi.boolean().default(false)
      }).unknown()
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('/cookies?updated=true')
    }
  }
}]
