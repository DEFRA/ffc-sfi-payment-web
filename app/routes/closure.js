const fs = require('fs')
const { closureAdmin } = require('../auth/permissions')
const schema = require('./schemas/closure')
const bulkSchema = require('./schemas/bulk')
const { post } = require('../api')
const { processClosureData } = require('../closure')

module.exports = [{
  method: 'GET',
  path: '/closure/add',
  options: {
    auth: { scope: [closureAdmin] },
    handler: async (_request, h) => {
      return h.view('closure/add')
    }
  }
},
{
  method: 'GET',
  path: '/closure/bulk',
  options: {
    auth: { scope: [closureAdmin] },
    handler: async (_request, h) => {
      return h.view('closure/bulk')
    }
  }
},
{
  method: 'POST',
  path: '/closure/add',
  options: {
    auth: { scope: [closureAdmin] },
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('closure/add', { errors: error, frn: request.payload.frn, agreement: request.payload.agreement, day: request.payload.day, month: request.payload.month, year: request.payload.year }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      let day = request.payload.day.toString()
      if (day.length !== 2) {
        day = `0${request.payload.day}`
      }
      let month = request.payload.month.toString()
      if (month.length !== 2) {
        month = `0${request.payload.month}`
      }
      const date = `${request.payload.year}-${month}-${day}T00:00:00`
      await post('/closure/add', { frn: request.payload.frn, agreement: request.payload.agreement, date }, null)
      return h.redirect('/closure')
    }
  }
},
{
  method: 'POST',
  path: '/closure/bulk',
  handler: async (request, h) => {
    const data = fs.readFileSync(request.payload.file.path, 'utf8')
    if (!data) {
      return h.view('closure/bulk', { errors: { details: [{ message: 'An error occurred whilst reading the file' }] } }).code(400).takeover()
    }
    const { uploadData, errors } = await processClosureData(data)
    if (errors) {
      return h.view('closure/bulk', { errors }).code(400).takeover()
    }
    await post('/closure/bulk', { data: uploadData }, null)
    return h.redirect('/closure')
  },
  options: {
    auth: { scope: [closureAdmin] },
    validate: {
      payload: bulkSchema,
      failAction: async (request, h, error) => {
        return h.view('closure/bulk', { errors: error }).code(400).takeover()
      }
    },
    payload: {
      output: 'file',
      maxBytes: 1048576,
      multipart: true
    }
  }
}]
