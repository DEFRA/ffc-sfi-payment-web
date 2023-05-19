const { getBlobList } = require('../storage')
const ViewModel = require('./models/event-projection')
const Joi = require('joi')
const { schemeAdmin, holdAdmin, dataView } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/event-projection',
  options: {
    auth: { scope: [schemeAdmin, holdAdmin, dataView] },
    validate: {
      query: Joi.object({
        frn: Joi.number().greater(999999999).less(10000000000)
      }),
      failAction: async (_request, h, error) => {
        return h.view('event-projection', new ViewModel(null, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const frn = request.query.frn

      if (frn) {
        const blobData = await getBlobList(frn)
        return h.view('event-projection', { blobData, ...new ViewModel(frn) })
      }

      return h.view('event-projection', new ViewModel(null))
    }
  }
}
