const createServer = require('../../../../app/server')
jest.mock('../../../../app/auth/azure-auth')
jest.mock('../../../../app/storage')
const { getBlobList, getProjection } = require('../../../../app/storage')

describe('event projection detail', () => {
  let server
  const url = '/event-projection-detail'
  const frn = '1000000001'
  const agreementNumber = 'SIP000000000001'
  const paymentRequestNumber = '1'
  const prefix = `${frn}/${agreementNumber}/${paymentRequestNumber}`
  const parseJsonDate = require('../../../../app/parse-json-date')

  const auth = {
    strategy: 'session-auth',
    credentials: {
      account: {
        name: 'A Farmer'
      }
    }
  }

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

  const projection = {
    correlationId: '1234567890',
    agreementNumber,
    paymentRequestNumber,
    frn,
    events: [
      {
        eventType: 'batch-processing'
      },
      {
        eventType: 'payment-request-enrichment'
      }
    ]
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  describe('GET requests', () => {
    const method = 'GET'

    test('returns 200', async () => {
      const fullUrl = `${url}/${prefix}`
      getBlobList.mockResolvedValue(blobs)
      getProjection.mockResolvedValue(projection)

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.statusCode).toBe(200)
    })

    test('returns 200 with eventType supplied', async () => {
      const fullUrl = `${url}/${prefix}?eventType=payment-request-enrichment`
      getBlobList.mockResolvedValue(blobs)
      getProjection.mockResolvedValue(projection)

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.statusCode).toBe(200)
    })

    test('returns 404 with no event details returned for incorrect eventType', async () => {
      const fullUrl = `${url}/${prefix}?eventType=invalid`
      getBlobList.mockResolvedValue(blobs)
      getProjection.mockResolvedValue(projection)

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.request.response.statusCode).toBe(302)
      expect(res.headers.location).toBe('/404')
    })

    test('returns 404 with no blob list returned', async () => {
      const fullUrl = `${url}/${prefix}`
      blobs.blobList = []
      getBlobList.mockResolvedValue(blobs)

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.request.response.statusCode).toBe(302)
      expect(res.headers.location).toBe('/404')
    })

    test('returns 404 with no event details returned', async () => {
      const fullUrl = `${url}/${prefix}`
      getBlobList.mockResolvedValue(blobs)
      getProjection.mockResolvedValue({})

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.request.response.statusCode).toBe(302)
      expect(res.headers.location).toBe('/404')
    })

    test('returns 404 with invalid route', async () => {
      const fullUrl = `${url}/${frn}`
      getBlobList.mockResolvedValue(blobs)
      getProjection.mockResolvedValue({})

      const res = await server.inject({ method, url: fullUrl, auth })
      expect(res.request.response.statusCode).toBe(404)
      expect(res.request.response.source.template).toBe('404')
    })
  })
})
