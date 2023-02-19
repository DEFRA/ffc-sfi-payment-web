const { schemeAdmin, holdAdmin } = require('../auth/permissions')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/monitoring',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin] }
  },
  handler: async (request, h) => {
    if (!config.useV2Events) {
      return h.redirect('/event-projection')
    }
    return h.view('tbc')
  }
}
