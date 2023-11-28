const fs = require('fs')
const { closureAdmin } = require('../auth/permissions')
const schema = require('./schemas/closure')
const bulkSchema = require('./schemas/bulk-closure')
const parsedSchema = require('./schemas/parsed-closure')
const { post } = require('../api')

module.exports = [{
  method: 'GET',
  path: '/closure',
  options: {
    auth: { scope: [closureAdmin] },
    handler: async (_request, h) => {
      return h.view('closure')
    }
  }
},
{
  method: 'GET',
  path: '/bulk-closure',
  options: {
    auth: { scope: [closureAdmin] },
    handler: async (_request, h) => {
      return h.view('bulk-closure')
    }
  }
},
{
  method: 'POST',
  path: '/closure',
  options: {
    auth: { scope: [closureAdmin] },
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('closure', { errors: error, frn: request.payload.frn, agreement: request.payload.agreement, day: request.payload.day, month: request.payload.month, year: request.payload.year }).code(400).takeover()
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
      request.payload.date = `${request.payload.year}-${month}-${day}T00:00:00`
      delete request.payload.day
      delete request.payload.month
      delete request.payload.year
      await post('/closure', { frn: request.payload.frn, agreement: request.payload.agreement, date: request.payload.date }, null)
      return h.redirect('/')
    }
  }
},
{
  method: 'POST',
  path: '/bulk-closure',
  handler: async (request, h) => {
    const uploadData = []
    const data = fs.readFileSync(request.payload.file.path, 'utf8')
    if (!data) {
      return h.view('bulk-closure', { errors: { details: [{ message: 'An error occurred whilst reading the file' }] } }).code(400).takeover()
    }
    const splitData = data.split(/\r?\n|\r|\n/g)
    const closureLines = splitData.filter((str) => str !== '')
    for (let i = 0; i < closureLines.length; i++) {
      const closure = closureLines[i]
      const clData = closure.split(',')
      if (clData.length !== 3) {
        return h.view('bulk-closure', { errors: { details: [{ message: 'The file is not in the expected format' }] } }).code(400).takeover()
      } else {
        const parsedData = {
          frn: clData[0],
          agreementNumber: clData[1],
          closureDate: clData[2]
        }
        const result = parsedSchema.validate(parsedData, {
          abortEarly: false
        })
        if (result.error) {
          return h.view('bulk-closure', { errors: result.error }).code(400).takeover()
        } else {
          uploadData.push(parsedData)
        }
      }
    }
    await post('/bulk-closure', { data: uploadData }, null)
    return h.redirect('/')
  },
  options: {
    auth: { scope: [closureAdmin] },
    validate: {
      payload: bulkSchema,
      failAction: async (request, h, error) => {
        return h.view('bulk-closure', { errors: error }).code(400).takeover()
      }
    },
    payload: {
      output: 'file',
      maxBytes: 209715200,
      multipart: true
    }
  }
}]
