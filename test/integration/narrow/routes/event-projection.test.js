const cheerio = require('cheerio')
const createServer = require('../../../../app/server')
jest.mock('../../../../app/auth')
jest.mock('../../../../app/storage')
const { getBlobList } = require('../../../../app/storage')
const parseJsonDate = require('../../../../app/parse-json-date')
const { schemeAdmin } = require('../../../../app/auth/permissions')

describe('event projection', () => {
  let server
  const url = '/event-projection'
  const frn = '1000000001'
  const agreementNumber = 'SIP000000000001'
  const paymentRequestNumber = '1'
  const prefix = `${frn}/${agreementNumber}/${paymentRequestNumber}`
  let auth

  const blobs = {
    prefix,
    blobList: [{
      frn,
      agreementNumber,
      requestNumber: paymentRequestNumber,
      fileName: '1234567890.json',
      blob: `${prefix}/1234567890.json`,
      updatedDate: parseJsonDate('2020-01-01T00:00:00.000Z', false)
    }]
  }

  beforeEach(async () => {
    auth = { strategy: 'session-auth', credentials: { scope: [schemeAdmin] } }
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200', async () => {
      const res = await server.inject({ method, url, auth })
      expect(res.statusCode).toBe(200)
    })

    test('returns event array for an FRN', async () => {
      const urlWithFrn = `${url}?frn=${frn}`
      getBlobList.mockResolvedValue(blobs)

      const res = await server.inject({ method, url: urlWithFrn, auth })
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      const events = $('.govuk-table__body tr')
      expect(events.length).toEqual(1)
      events.each((event) => {
        const eventCells = $('td', event)
        expect(eventCells.eq(0).text()).toEqual(frn)
        expect(eventCells.eq(1).text()).toEqual(agreementNumber)
        expect(eventCells.eq(2).text()).toEqual(paymentRequestNumber)
        expect(eventCells.eq(3).text()).toEqual('01/01/2020 00:00:00')
      })
    })

    test('returns no data for a supplied FRN and shows message', async () => {
      const urlWithFrn = `${url}?frn=${frn}`
      blobs.blobList = []
      getBlobList.mockResolvedValue(blobs)

      const res = await server.inject({ method, url: urlWithFrn, auth })
      expect(res.statusCode).toBe(200)

      const $ = cheerio.load(res.payload)
      expect($('#no-event-text').text()).toEqual('No events found.')
    })

    test.each([
      { frnTest: 1 },
      { frnTest: 12345678901 },
      { frnTest: 'a' }
    ])('returns error for an invalid FRN %p and shows error message', async (frnTest) => {
      const urlWithFrn = `${url}?frn=${frnTest}`
      blobs.blobList = []
      getBlobList.mockResolvedValue(blobs)

      const res = await server.inject({ method, url: urlWithFrn, auth })
      expect(res.statusCode).toBe(400)

      const $ = cheerio.load(res.payload)
      expect($('#error-message').text()).toContain('must be a number')
    })
  })
})
