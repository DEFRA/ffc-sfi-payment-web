const { post } = require('../api')
const Joi = require('joi')
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
      payload: Joi.object({
        invoiceNumber: Joi.string().required().error(errors => {
          errors.forEach(err => { err.message = 'Enter a valid invoice number' })
          return errors
        })
      }),
      failAction: async (request, h, error) => {
        return h.view('reset-payment-request', { error, invoiceNumber: request.payload.invoiceNumber }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const { invoiceNumber } = request.payload
      try {
        await post('/payment-request/reset', { invoiceNumber })
        return h.redirect(`/reset-payment-request-success?invoiceNumber=${invoiceNumber}`)
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
      return h.view('payment-request/reset-success')
    }
  }
}]
