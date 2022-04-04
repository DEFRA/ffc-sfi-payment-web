const { post } = require('../api')
const schema = require('./schemas/invoice-number')
const { schemeAdmin } = require('../auth/permissions')

module.exports = [{
  method: 'GET',
  path: '/payment-request/reset',
  options: {
    auth: { scope: [schemeAdmin] },
    handler: async (request, h) => {
      return h.view('reset-payment-request')
    }
  }
},
{
  method: 'POST',
  path: '/payment-request/reset',
  options: {
    auth: { scope: [schemeAdmin] },
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('reset-payment-request', { error, invoiceNumber: request.payload.invoiceNumber }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const { invoiceNumber } = request.payload
      try {
        await post('/payment-request/reset', { invoiceNumber })
        return h.redirect(`/payment-request/reset-success?invoiceNumber=${invoiceNumber}`)
      } catch (err) {
        return h.view('reset-payment-request', { error: err.data?.payload?.message ?? err.message, invoiceNumber }).code(412)
      }
    }
  }
},
{
  method: 'GET',
  path: '/payment-request/reset-success',
  options: {
    auth: { scope: [schemeAdmin] },
    handler: async (request, h) => {
      return h.view('reset-payment-request-success', { invoiceNumber: request.query.invoiceNumber })
    }
  }
}]
